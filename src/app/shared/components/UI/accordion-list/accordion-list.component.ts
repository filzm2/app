import {Component, Input, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {FormGroupDirective} from '@angular/forms';

@Component({
  selector: 'app-ui-accordion-list',
  templateUrl: 'accordion-list.component.html',
  styleUrls: ['accordion-list.component.scss']
})

export class AccordionListComponent {
  @Input() accordionList = [
    {
      id: 'panel-1',
      title: 'Panel One',
      description: 'Description One',
      isDisabled: false,
      isExpanded: false,
      product: 'Возобновляемая кредитная линия',
      borrower: 'ООО "Рога и Копыта"',
      inn: '1234567890',
      summary: '124890',
      borrowerGroup: [
        {inn: 1234567890, kpp: 1234512345, borrower: 'ООО Копыта и' },
        {inn: 1234567890, kpp: 1234512345, borrower: 'ООО Нечто и' }
      ]
    }
  ];
  // @ViewChild('accordion', {static: true}) Accordion: MatAccordion;
  // @ViewChild(FormGroupDirective) myForm;
  flat = true;
  borrowers = [
    {
      inn: 1234567890,
      kpp: 1234512345,
      borrower: 'ООО "Рога и "'
    }, {
      inn: 1234567890,
      kpp: 1234512345,
      borrower: 'ООО "Копыта и "'
    }, {
      inn: 1234567890,
      kpp: 1234512345,
      borrower: 'ООО "Нечто и "'
    },
  ];

  selectedBorrowers = [
  ];

  currentBorrower = {
    inn: null,
    kpp: null,
    borrower: ''
  };
  beforePanelClosed(panel): void{
    panel.isExpanded = false;
  }
  beforePanelOpened(panel): void{
    panel.isExpanded = true;
  }

  afterPanelClosed(tmp): void{
  }
  afterPanelOpened(tmp): void{
  }

  selectBorrower($event): void {
    this.currentBorrower = this.borrowers.find( item => item.borrower === $event.value);
  }

  addBorrower(): void {
    this.selectedBorrowers.push({...this.currentBorrower});
    this.clearBorrower();
  }

  clearBorrower(): void {
    this.currentBorrower = Object.assign({}, {
      inn: null,
      kpp: null,
      borrower: ''
    });
  }

  deleteItemProduct(id): void {
    this.accordionList = this.accordionList.filter((item, idx) =>  item.id !== id);
  }
  clearItemBorrower(idx: number, borrower: any): void {
    this.accordionList[idx].borrowerGroup = this.accordionList[idx].borrowerGroup.filter((item, index) => item.borrower !== borrower);
  }
}
