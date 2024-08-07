import { Component } from '@angular/core';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { SupplierService } from 'src/app/core/services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent {


  suppliers: any[] = [];
  selectedSupplier !:any;

  constructor(private supplierService:SupplierService){

  }

  colDefs : (ColDef | ColGroupDef)[] = [
    {headerName:"Supplier ID: ",field:"_id",minWidth:200},
    {headerName:"Supplier Name :",field:"S_Name",minWidth:280},
    {headerName:"Supplier Contact: ",field:"S_Contact"},
    {headerName:"Supplier Address",field:"S_Address",minWidth:400},
    {
      headerName:"Action",
      field:"action",
      cellRenderer:()=>{
        return `
          <button type="button" class="btn btn-success btn-sm" data-action-type="edit">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" data-action-type="delete">Delete</button>
        `
      },
      onCellClicked:(params:any)=>{
        if(params.event.target.dataset.actionType==="edit"){
          this.editSupplier(params.data.S_Id);
        }
        if(params.event.target.dataset.actionType==="delete"){
          this.deleteSupplier(params.data.S_Id);
        }
      }
    }
  ]

  ngOnInit():void{

    this.supplierService.listSuppliers().subscribe((res)=>{
      this.suppliers =  res.suppliers;
    })
  }

  deleteSupplier(Id:number){
    this.supplierService.deleteData(Id);
  }

  editSupplier=(Id:number)=>{

    const foundSupplier = this.suppliers.find((sup)=>sup.S_Id===Id);
    if(foundSupplier){
      this.selectedSupplier = foundSupplier;
      console.log(this.selectedSupplier);
    }else{
      console.log(`no supplier found with id${Id}`);
    }
  }
  
  
} 
