import { Controller, Get, Query } from '@nestjs/common';
import { MicrosoftGraphService } from './microsoft-graph.service';

@Controller('microsoft-graph')
export class MicrosoftGraphController {
  constructor(private readonly microsoftGraphService: MicrosoftGraphService) {}

  @Get('transcriptions')
  async getTranscriptions(@Query('meetingId') meetingId: string) {
    return this.microsoftGraphService.getTranscriptions(meetingId);
  }

  @Get('all-transcriptions')
  async listTranscriptions() {
    return this.microsoftGraphService.listTranscriptions();
  }
}
