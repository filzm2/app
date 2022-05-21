import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: 'docs.component.html',
  styleUrls: ['docs.component.scss']
})

export class DocsComponent {
@Input() parts =  [
    { id: 1, title: 'Дополнительные документы', limit: 50, upload: 21, expand: false,
      docs: [
        {id: 1, title: 'График строительства (по форме Банка)', type: 'docx'}
      ]
    },
    { id: 2, title: 'БКИ', limit: 45, upload: 19, expand: false,
      docs: [
        {id: 1, title: 'График строительства (по форме Банка)', type: 'docx'}
      ]
    },
    { id: 3, title: 'Финансовый план', limit: 15, upload: 12, expand: false,
      docs: [
        {id: 1, title: 'График строительства (по форме Банка)', type: 'docx'}
      ]
    },
    { id: 4, title: 'Профсуждения', limit: 12, upload: 2, expand: false,
      docs: [
        {id: 1, title: 'График строительства (по форме Банка)', type: 'docx'}
      ]
    },
    { id: 5, title: 'Финансовые документы', limit: 53, upload: 5, expand: false,
      docs: [
        {id: 1, title: 'График строительства (по форме Банка)'}
      ]
    }
  ];

  getWidthFill(limit, upload): string {
    return `${Math.floor((upload * 100) / limit)}%`;
  }

  showPartDocs(idx: number): void {
    this.parts[idx].expand = !this.parts[idx].expand;
  }
}
