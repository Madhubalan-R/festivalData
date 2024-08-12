import { Test, TestingModule } from '@nestjs/testing';
import { FestivalService } from '../services/app.service';
import axios from 'axios';
import * as fs from 'fs';

jest.mock('axios');
jest.mock('fs');

describe('FestivalService', () => {
  let service: FestivalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FestivalService],
    }).compile();

    service = module.get<FestivalService>(FestivalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchFestivalData', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should fetch data from API', async () => {
      const mockData = [{ name: 'Festival1', bands: [] }];
      (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await service.fetchFestivalData();
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals');
    });

    it('should handle errors', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      const result = await service.fetchFestivalData();
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data from API', expect.any(Error));
    });
  });


  describe('processFestivalData', () => {
    it('should process festival data correctly', () => {
      const mockData = [
        {
          name: 'Festival1',
          bands: [
            { name: 'Band1', recordLabel: 'Label1' },
            { name: 'Band2', recordLabel: 'Label2' },
          ],
        },
        {
          name: 'Festival2',
          bands: [
            { name: 'Band1', recordLabel: 'Label1' },
            { name: 'Band3', recordLabel: 'Label3' },
          ],
        },
      ];

      const result = service.processFestivalData(mockData);
      expect(result).toEqual([
        {
          label: 'Label1',
          bands: [
            { name: 'Band1', festivals: [{ name: 'Festival1' }, { name: 'Festival2' }] },
          ],
        },
        {
          label: 'Label2',
          bands: [
            { name: 'Band2', festivals: [{ name: 'Festival1' }] },
          ],
        },
        {
          label: 'Label3',
          bands: [
            { name: 'Band3', festivals: [{ name: 'Festival2' }] },
          ],
        },
      ]);
    });
  });

  describe('getFestivalData', () => {
    it('should return cached data if available', async () => {
      const mockData = [{ label: 'Label1', bands: [] }];
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      const result = await service.getFestivalData();
      expect(result).toEqual(mockData);
      expect(fs.existsSync).toHaveBeenCalledWith(service['jsonFilePath']);
      expect(fs.readFileSync).toHaveBeenCalledWith(service['jsonFilePath'], 'utf8');
    });

    it('should fetch, process, and handle saveDataToCache error if not cached', async () => {
      const mockData = [{ name: 'Festival1', bands: [] }];
      const processedData = [{ label: 'Label1', bands: [] }];
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (axios.get as jest.Mock).mockResolvedValue({ data: mockData });
      jest.spyOn(service, 'processFestivalData').mockReturnValue(processedData);

      const result = await service.getFestivalData();
      expect(result).toEqual(processedData);
      expect(axios.get).toHaveBeenCalledWith('https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals');
      expect(service.processFestivalData).toHaveBeenCalledWith(mockData);
    });

  });
});
