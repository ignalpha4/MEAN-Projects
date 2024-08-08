import { Component, OnInit } from '@angular/core';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CategoryService } from 'src/app/core/services/category.service';



@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})

export class CategoryListComponent implements OnInit {

  categories: any[] = [];
  selectedCat!: any;

  constructor(private categoryService:CategoryService) {}

  colDefs: (ColDef | ColGroupDef)[] = [
    { headerName: 'Category ID', field: '_id', minWidth: 500 },
    { headerName: 'Category Name', field: 'C_Name', minWidth: 600 },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: () => {
        return `
          <button type="button" class="btn btn-sm btn-success" data-action-type="edit">Edit</button>
          <button type="button" class="btn btn-sm btn-danger" data-action-type="delete">Delete</button>
        `;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.dataset.actionType === 'edit') {
          this.editCategory(params.data._id);
        }
        if (params.event.target.dataset.actionType === 'delete') {
          this.deleteCategory(params.data._id);
        }
      }
    }
  ];

  ngOnInit(): void {

    this.categoryService.listCategory().subscribe((res:any)=>{
      this.categories = res.categories;
    })

  }

  deleteCategory(Id: number): void {
   this.categoryService.deleteCategory(Id).subscribe((res:any)=>{
      if(res.status){
        alert(res.message);
      }else{
        alert(res.message);
      }
   })
  }

  editCategory(Id: number): void {

    const foundCategory = this.categories.find((cat:any) => cat._id === Id);

    if (foundCategory) {
      this.selectedCat = foundCategory;
      console.log(this.selectedCat);
    } else {
      console.log(`Category with ID ${Id} not found.`);
    }
  }

}
