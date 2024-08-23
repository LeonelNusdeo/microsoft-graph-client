import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

@Injectable()
export class MicrosoftGraphService implements OnModuleInit {
  private graphClient: Client;

  onModuleInit() {
    const credential = new ClientSecretCredential(
      process.env.MICROSOFT_TENANT_ID,
      process.env.MICROSOFT_CLIENT_ID,
      process.env.MICROSOFT_CLIENT_SECRET,
    );

    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
          return tokenResponse.token;
        },
      },
    });
  }

  async getTranscriptions(meetingId: string): Promise<any> {
    return this.graphClient.api(`/me/onlineMeetings/${meetingId}/transcripts`).get();
  }


  // 1. list all users
  // 2. for each user
  //    2.1. get all meetings
  //    2.2. get meeting transcript
  async listTranscriptions() {
    // 1
    const users = await this.graphClient.api('/users').get();
    /*
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users",
    "value": [
        {
            "businessPhones": [],
            "displayName": "Conf Room Adams",
            "givenName": null,
            "jobTitle": null,
            "mail": "Adams@contoso.com",
            "mobilePhone": null,
            "officeLocation": null,
            "preferredLanguage": null,
            "surname": null,
            "userPrincipalName": "Adams@contoso.com",
            "id": "6ea91a8d-e32e-41a1-b7bd-d2d185eed0e0"
        },
        {
            "businessPhones": [
                "425-555-0100"
            ],
            "displayName": "MOD Administrator",
            "givenName": "MOD",
            "jobTitle": null,
            "mail": null,
            "mobilePhone": "425-555-0101",
            "officeLocation": null,
            "preferredLanguage": "en-US",
            "surname": "Administrator",
            "userPrincipalName": "admin@contoso.com",
            "id": "4562bcc8-c436-4f95-b7c0-4f8ce89dca5e"
        }
    ]
}
        */

    users.value.filter(user => user.displayName === "Leonel Nusdeo").map(async (user) => {
      console.debug(`user: ${user.displayName}`)
      try {
        const events = await this.graphClient.api(`/users/${user.id}/events`).get();
        events.value.map(async (event) => {
          console.debug(event.subject)

        //   // console.debug(`************************\n\tevent: ${event.bodyPreview}\n************************`);
        //   console.debug(event);
          const match = event.onlineMeeting.joinUrl.match(/19%3ameeting_(.*?)%40/);
          const meetingId = match?.[1] ?? null;
          if (!meetingId) {
            console.debug(`no meeting id`)
          }


          const transcripts = await this.graphClient.api(`/users/${user.id}/onlineMeetings/${meetingId}/transcripts`).get();
          if (!transcripts.value.length) {
            console.debug("AAAAAAAAA");

            console.debug(transcripts);
          } else {
            console.debug("BBBBBBBBB");

            transcripts.value.map(async (transcript) => {
              console.debug(transcript);
            })
          }
        })
      } catch (error) {
        console.error(error);
      }
    })

    return 'OK';
  }
}
