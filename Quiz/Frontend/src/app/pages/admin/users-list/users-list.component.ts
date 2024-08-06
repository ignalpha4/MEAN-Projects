import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  users: any[] = [];

  columnDefs = [
    { headerName: 'Username', field: 'name', sortable: true, filter: true, minWidth: 500 },
    { headerName: 'Email', field: 'email', sortable: true, filter: true, minWidth: 500 },
    {
      headerName: 'Actions',
      cellRenderer: () => {
        return `
          <button class="btn btn-sm btn-primary" data-action-type="viewStats">View Stats</button>
        `;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.dataset.actionType === 'viewStats') {
          this.viewUserStats(params.data.email);
        }
      },
      minWidth: 250
    }

  ];

  constructor(private userService: AuthService, private router: Router) {

    let data: any;
    this.userService.getAllUsers().subscribe((res: any) => {
      data = res.users;
      console.log(data);

      this.users = data?.filter((user: any) => user.role === 'user');
      
    });

  }
  viewUserStats(email: string) {
    localStorage.setItem('userEmail', email);
    this.router.navigate(['pages/admin/dashboard/userStats'],{queryParams: {email}});
  }

}
