import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

type emailType = {
  href: string,
  emails: string,
  emailsParsed: { [key: string]: string }[],
  title: string,
  dashboardId: string,
  chartId: string,
};

@Component({
  selector: 'app-mailing-container',
  templateUrl: './mailing.component.html',
  styleUrls: ['./mailing.component.scss'],
})
export class MailingComponent implements OnInit {
  public emails: Array<emailType> = [];

  constructor() { }

  async ngOnInit(): Promise<void> {
    await this.getUsers();
  }

  async getUsers(): Promise<void> {
    this.emails = [];

    const response = await fetch(`${environment.APIForSendingEmails}/users`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
    });
    const emails = await response.json();

    Object.values(emails).forEach((email: { [key: string]: emailType }): void => {
      Object.values(email).forEach((emailObject: emailType): void => {
        if (emailObject.chartId === '0' || Number(emailObject.chartId) > -1) {
          emailObject.href = `${location.origin}?c=${emailObject.dashboardId}:${emailObject.chartId}`;
        } else {
          emailObject.href = `${location.origin}?c=${emailObject.dashboardId}`;
        }

        emailObject.emailsParsed = JSON.parse(emailObject.emails);
      });

      this.emails = this.emails.concat(Object.values(email) as emailType[]);
    });
  }

  async unsubscribe(emailObject: emailType): Promise<void> {
    const username = localStorage.getItem('username');
    const { dashboardId, chartId } = emailObject;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('dashboardId', dashboardId);
    formData.append('chartId', chartId);

    await fetch(`${environment.APIForSendingEmails}/unsubscribe`, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: formData,
    });

    await this.getUsers();
  }
}
