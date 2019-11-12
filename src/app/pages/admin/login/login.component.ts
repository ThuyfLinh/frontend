import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { USER_ROLES, ADMIN, SUPER_ADMIN } from '../../../constants/constant';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm: FormGroup;
    public userRoles = USER_ROLES;
    constructor(
        private apiService: ApiService,
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
    async login() {
        try {
            const user = this.loginForm.value;
            if (this.loginForm.invalid) {
                return;
            }
            const res: any = await this.apiService.login(user);
            if (res.customer.roles.find(x => x.Name === ADMIN.name) || res.customer.roles.find(x => x.Name === SUPER_ADMIN.name)) {
                localStorage.setItem('adminInfo', JSON.stringify({ data: res.customer }));
                this.messageService.add({ severity: 'success', summary: 'Đăng nhập thành công' });
                this.router.navigate(['admin/dashboard']);
            }

        } catch (e) {
            this.messageService.add({ severity: 'error', summary: 'Đăng nhập không thành công', detail: e.error.message });
        }
    }
    get f() { return this.loginForm.controls; }
}