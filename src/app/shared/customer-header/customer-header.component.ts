import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelperService } from '../../services/helper/helper.service';
import { ApiService } from '../../services/api/api.service';
import { Router } from '@angular/router';
import { ADMIN, SUPER_ADMIN, USER_ROLES } from '../../constants/constant';
import { CartService } from '../../services/shoppingCart/cart.service';
@Component({
    selector: 'app-customer-header',
    templateUrl: './customer-header.component.html',
    styleUrls: ['./customer-header.component.scss']
})
export class CustomerHeaderComponent implements OnInit, OnDestroy {

    @ViewChild('modalLogin', { static: true }) modalLogin: ElementRef;

    public modalRef: BsModalRef;
    public items: MenuItem[] = [];
    public loginForm: FormGroup;
    public userRoles = USER_ROLES;
    public user: any;
    public cart: any;
    public modalConfig: ModalOptions = {
        animated: true
    };
    public listCatalog = [];
    constructor(
        public modalService: BsModalService,
        private formBuilder: FormBuilder,
        public helperService: HelperService,
        private apiService: ApiService,
        private router: Router,
        private messageService: MessageService,
        public cartService: CartService
    ) {
        this.initForm();
        // this.cartService.cartSubject.subscribe((res: any) => {
        //     console.log(res);
        // });
    }

    ngOnInit() {
        this.getListCatalog();
        // this.items = [
        //     {
        //         label: 'Apple', icon: 'fa fa-fw fa-apple',
        //     },
        //     {
        //         label: 'Huawei', icon: 'fa fa-fw fa-mobile',
        //     },
        //     {
        //         label: 'Oppo', icon: 'fa fa-fw fa-android',
        //     },
        //     {
        //         label: 'Samsung', icon: 'fa fa-fw fa-android',
        //     },
        //     {
        //         label: 'ViVo', icon: 'fa fa-fw fa-android',
        //     },
        //     {
        //         label: 'Realme', icon: 'fa fa-fw fa-android',
        //     },
        // ];
        this.user = JSON.parse(localStorage.getItem('userInfo'));
    }

    openModal() {
        this.modalRef = this.modalService.show(this.modalLogin, this.modalConfig);
    }
    closeModal() {
        this.modalRef.hide();
    }

    initForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
    async login() {
        this.helperService.showLoading();
        try {
            const user = this.loginForm.value;
            if (this.loginForm.invalid) {
                this.messageService.add({ severity: 'error', summary: 'Phải nhập đẩy đủ thông tin' });
                this.helperService.hideLoading();
                return;
            }

            const res: any = await this.apiService.login(user);
            localStorage.setItem('userInfo', JSON.stringify({ data: res.accessToken }));
            this.user = JSON.parse(localStorage.getItem('userInfo'));

            this.helperService.hideLoading();
            this.messageService.add({ severity: 'success', summary: 'Đăng nhập thành công' });
            this.closeModal();

        } catch (e) {
            console.log(e);
            this.messageService.add({ severity: 'error', summary: 'Đăng nhập không thành công', detail: e.error.message });
            this.helperService.hideLoading();
        }
    }
    async logout() {
        this.helperService.showLoading();
        try {
            const res: any = await this.apiService.logout();

            localStorage.clear();
            this.cartService.clearCart();
            this.user = null;
            if (this.router.url === '/shopping-cart') {
                this.router.navigate(['home']);
            }
            this.helperService.hideLoading();
        } catch (e) {
            this.helperService.hideLoading();
            console.log(e.error.message);
        }
    }
    gotoPage(page) {
        this.router.navigate([page]);
    }

    getListCatalog() {
        this.helperService.showLoading();
        this.apiService.getAllCatalog().then((res: any) => {
            this.listCatalog = res.data.slice(0, 7);
            this.listCatalog.forEach((cat) => {
                const item: MenuItem = {
                    label: cat.Brand,
                    url: `#/product-category/${cat.CatalogId}`,
                    icon: cat.Brand === 'Apple' ? 'fa fa-fw fa-apple' : 'fa fa-fw fa-android'
                };
                this.items.push(item);
            });
            this.helperService.hideLoading();
        }).catch(err => {
            this.helperService.hideLoading();
        });
    }
    get f() { return this.loginForm.controls; }
    ngOnDestroy() {
        // this.cartService.cartSubject.unsubscribe();
    }
}


