import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent {
  categories: any;
  selectedCategory: any = { name: '' };
  isEditMode: boolean = false;

  @ViewChild('categoryModal') categoryModal!: ElementRef;

  constructor(private categoryService: CategoryService, private renderer: Renderer2) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService.getData().subscribe((res: any) => {
      this.categories = res.Category;
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedCategory = { name: '' };
    this.openModal();
  }

  openEditModal(category: any) {
    this.isEditMode = true;
    this.selectedCategory = { ...category };
    this.openModal();
  }

  openModal() {
    this.renderer.setStyle(this.categoryModal.nativeElement, 'display', 'block');
    this.renderer.addClass(this.categoryModal.nativeElement, 'show');
    this.renderer.setAttribute(this.categoryModal.nativeElement, 'aria-hidden', 'false');
    this.renderer.setAttribute(this.categoryModal.nativeElement, 'aria-modal', 'true');
  }

  closeModal() {
    this.renderer.setStyle(this.categoryModal.nativeElement, 'display', 'none');
    this.renderer.removeClass(this.categoryModal.nativeElement, 'show');
    this.renderer.setAttribute(this.categoryModal.nativeElement, 'aria-hidden', 'true');
    this.renderer.removeAttribute(this.categoryModal.nativeElement, 'aria-modal');
  }

  saveCategory() {
    if (this.isEditMode) {
      this.categoryService.updateCategory(this.selectedCategory._id, this.selectedCategory).subscribe((res: any) => {
        if (res.success) {
          alert('Updated Category');
          this.fetchCategories();
          this.closeModal();
        } else {
          console.log('Error updating the category');
        }
      });
    } else {
      this.categoryService.addCategory(this.selectedCategory).subscribe((res: any) => {
        if (res.success) {
          alert('Added Category');
          this.fetchCategories();
          this.closeModal();
        } else {
          console.log('Error adding the category');
        }
      });
    }
  }

  deleteCategory(_id: string) {
    this.categoryService.deleteCategory(_id).subscribe(res => {
      if (res.success) {
        alert('Category Deleted!');
        this.fetchCategories();
      } else {
        alert('Error deleting category!');
      }
    }, (error) => {
      console.log(error);
    });
  }
}

