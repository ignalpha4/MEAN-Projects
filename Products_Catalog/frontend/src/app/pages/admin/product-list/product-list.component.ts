import { Component } from '@angular/core';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],

})
export class ProductListComponent {

  products:any[] = [];
  selectedProduct!: any ;

  constructor(private productService:ProductService){};

  ColDef: (ColDef | ColGroupDef)[] = [
    { headerName: 'ID', field: '_id', maxWidth: 90 },
    { headerName: 'Name', field: 'P_Name' },
    { headerName: 'Category', field: 'category_details.C_Name' },
    {headerName:'Description', field: 'P_Desc'},
    { headerName: 'Price', field: 'P_Price' },
    { headerName: 'Supplier', field: 'supplier_details.S_Name' },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: () => {
        return `
        <button type="button" class="btn btn-sm btn-success" data-action-type="edit">Edit</button>
        <button type="button" class="btn btn-sm btn-danger" data-action-type="delete">Delete</button>
      `;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.dataset.actionType === 'edit') {
          this.editProduct(params.data._id);
        }

        if (params.event.target.dataset.actionType === 'delete') {
          this.deleteProduct(params.data._id);
        }
      },
    },
  ];

  ngOnInit():void{

    this.productService.listProducts().subscribe((res:any)=>{
        this.products = res.products;
    })
  }

  deleteProduct = (Id: number):void => {
   this.productService.deleteProduct(Id).subscribe((res:any)=>{
    if(res.status){
      alert(res.message);
    }else{
      alert(res.message);
    }
   })
  };

  editProduct = (Id: number) :void=> {
    const foundProduct = this.products.find((pro)=>pro._id===Id)

    if(foundProduct){
      this.selectedProduct = foundProduct;
      console.log(this.selectedProduct);
    }else{
      console.log(`No product found with Id${Id}`);
    }
  };

}
