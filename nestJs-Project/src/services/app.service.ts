import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';

export interface Festival {
  name: string;
  bands: Band[];
}

export interface Band {
  name: string;
  recordLabel: string;
}
export interface ProcessedBand {
  name: string;
  festivals: { name: string }[];
}

export interface RecordLabel {
  label: string;
  bands: ProcessedBand[];
}

@Injectable()
export class FestivalService {
  private readonly jsonFilePath = path.resolve(__dirname, 'sample.json');

  async fetchFestivalData(): Promise<Festival[]> {
    try {
      const response = await axios.get('https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals');
      logger.info('Fetched festival data from API');
      return response.data;
    } catch (error) {
      logger.error('Error fetching data from API', error);
      return [];
    }
  }

  processFestivalData(data: Festival[]): RecordLabel[] {
    logger.info('Processing festival data');
    const recordLabelsMap: Map<string, RecordLabel> = new Map();

    data.forEach(festival => {
      festival.bands.forEach(band => {
        const labelName = band.recordLabel || 'Unknown';
        const label = recordLabelsMap.get(labelName) || { label: labelName, bands: [] };

        const existingBand = label.bands.find(b => b.name === band.name);
        if (existingBand) {
          if (festival.name) {
            existingBand.festivals.push({ name: festival.name });
          }
        } else {
          label.bands.push({
            name: band.name,
            festivals: festival.name ? [{ name: festival.name }] : []
          });
        }

        recordLabelsMap.set(labelName, label);
      });
    });

    const recordLabels = Array.from(recordLabelsMap.values());
    recordLabels.forEach(label => {
      label.bands.sort((a, b) => a.name.localeCompare(b.name));
      label.bands.forEach(band => {
        band.festivals.sort((a, b) => a.name.localeCompare(b.name));
      });
    });

    logger.info('Finished processing festival data');
    return recordLabels.sort((a, b) => a.label.localeCompare(b.label));
  }

  async getFestivalData(): Promise<RecordLabel[]> {
    if (this.isDataCached()) {
      logger.info('Reading cached festival data');
      return this.readCachedData();
    } else {
      logger.info('Fetching new festival data');
      const data = await this.fetchFestivalData();
      const processedData = this.processFestivalData(data);
      this.saveDataToCache(processedData);
      return processedData;
    }
  }

  private isDataCached(): boolean {
    return fs.existsSync(this.jsonFilePath);
  }

  private readCachedData(): RecordLabel[] {
    const data = fs.readFileSync(this.jsonFilePath, 'utf8');
    logger.info('Cached data read successfully');
    return JSON.parse(data) as RecordLabel[];
  }

  private saveDataToCache(data: RecordLabel[]) {
    fs.writeFileSync(this.jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
    logger.info('Data cached successfully');
  }
}
