import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export interface Festival {
  name: string;
}

export interface Band {
  name: string;
  festivals: Festival[];
}

export interface RecordLabel {
  label: string;
  bands: Band[];
}

@Injectable()
export class FestivalService {
  private readonly jsonFilePath = path.resolve(__dirname,'sample.json');

  async fetchFestivalData(): Promise<any[]> {
    try {
      const response = await axios.get('https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals'); 
      return response.data;
    } catch (error) {
      console.error('Error fetching data from API', error);
      return [];
    }
  }

  processFestivalData(data: any[]): RecordLabel[] {
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

    return recordLabels.sort((a, b) => a.label.localeCompare(b.label));
  }

  async getFestivalData(): Promise<RecordLabel[]> {
    if (this.isDataCached()) {
      return this.readCachedData();
    } else {
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
    return JSON.parse(data) as RecordLabel[];
  }

  private saveDataToCache(data: RecordLabel[]): void {
    fs.writeFileSync(this.jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
