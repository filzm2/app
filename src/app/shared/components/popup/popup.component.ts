import {Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalService} from '../../../core/services/modal.service';
import {OrderService} from '../../../core/services/order.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent implements OnInit, OnDestroy {
  @Input() id: string;
  element: any;
  secondStep: boolean;

  constructor(
    private orderService: OrderService,
    private modalService: ModalService,
    private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // this.orderService.completeTask('25dfc733-ec51-11ea-bb6c-0a580a80022a').subscribe(res => console.log(res));
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    // this.element.addEventListener('click', el => {
    //   if (el.target.className === 'jw-modal') {
    //     this.close();
    //   }
    // });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
    this.close();
  }

  // open modal
  open(): void {
    if (this.id === 'custom-modal-2') {
      this.secondStep = true;
      console.log('opened second modal!');
    }
    this.element.style.display = 'block';
    document.body.classList.add('jw-modal-open');
  }

  // close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('jw-modal-open');
  }

}
