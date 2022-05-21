import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-products-company',
  templateUrl: './products-company.component.html',
  styleUrls: ['./products-company.component.scss']
})
export class ProductsCompanyComponent implements OnInit, AfterViewInit, OnChanges {
  private _companyProducts = [];
  @Input() set companyProducts(value) {
    this._companyProducts = value;
  }

  get companyProducts() {
    return this._companyProducts;
  }

  @Output() products: EventEmitter<any> = new EventEmitter<any>();
  displayedColumns: string[] = ['num', 'productType', 'typeProductCondition', 'valueProductCondition', 'priceOffer', 'nonStandartProducts', 'codInclude'];
  dataSource: MatTableDataSource<ProductElement> = new MatTableDataSource<ProductElement>(this.companyProducts);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {
  }

  ngOnInit(): void {
    this.companyProducts ? this.dataSource = new MatTableDataSource<ProductElement>(this.companyProducts) : this.dataSource = new MatTableDataSource<ProductElement>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.companyProducts ? this.dataSource = new MatTableDataSource<ProductElement>(this.companyProducts) : this.dataSource = new MatTableDataSource<ProductElement>([]);
  }

  deleteItem(num) {
    const newList = this.companyProducts.filter(el => +el.num !== num);
    this.products.emit(newList);
    this.dataSource = new MatTableDataSource<ProductElement>(newList);
  }
}

export interface ProductElement {
  num: number;
  productType: string;
  typeProductCondition: string;
  valueProductCondition: string;
  priceOffer: string;
  nonStandartProducts: string;
  codInclude: boolean;
}

