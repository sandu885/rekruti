import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';

import {NgxSpinnerService} from 'ngx-spinner';

import {GlobalVariablesService} from '../../../services/global-variables/global-variables.service';
import {RekrutiApiService} from '../../../services/api/api.service';
import {UtilsService} from '../../../services/utils/utils.service';
import {NotificationsService} from '../../../services/notifications/notifications.service';

@Component({
    selector: 'app-employers',
    templateUrl: './employers.component.html',
    styleUrls: ['./employers.component.css']
})
export class EmployersComponent implements OnInit {

    @ViewChild('top') topContent: ElementRef;

    _opened: boolean;
    _sidebarMode: any = 'push';
    _autoCollapseWidth: any = 1100;
    windowWidth: any = window.innerWidth;

    employersData: any = {};

    constructor(private globalVar: GlobalVariablesService,
                private api: RekrutiApiService,
                private spinner: NgxSpinnerService,
                private utils: UtilsService,
                private notifications: NotificationsService) {
        this._opened = this.windowWidth > this._autoCollapseWidth;
    }

    ngOnInit() {
        this.globalVar.setRequestBodyEmployers('', 0, 'relevancy');
        this.globalVar.setUrlFacetsEmployers([]);
        this.getEmployersList();

        this.globalVar.sidebarStateChangedEmployersEvent.subscribe(() => {
            this._toggleSidebar();
        });
        this.globalVar.scrollContentToTopEmployersEvent.subscribe(() => {
            this.scrollToTop();
        });

        this.globalVar.employersListChangedEvent.subscribe(() => {
            this.getEmployersList();
        });
    }

    getEmployersList() {
        this.spinner.show();
        const body = this.globalVar.getRequestBodyEmployers();
        this.api.geoPlace_wSearch(body.keyword, body.from, this.globalVar.getUrlFacetsEmployers(), body.sort).then(
            reply => {
                this.employersData = reply;
                this.globalVar.setHasFacetSelectedEmployers(this.utils.countFacetSelected(reply.data.aggregations));
                this.globalVar.employersList(this.employersData);
                this.scrollToTop();
                this.spinner.hide();
            },
            (err) => {
                console.log(err);
                this.notifications.warning('', 10000);
                this.spinner.hide();
            }
        );
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.windowWidth = event.target.innerWidth;
        this.globalVar.windowWidthChangedEmployers(this.windowWidth);
        this._opened = this.windowWidth > this._autoCollapseWidth;
    }

    _toggleSidebar() {
        this._opened = !this._opened;
    }

    scrollToTop() {
        this.topContent.nativeElement.scrollIntoView({behavior: 'instant', block: 'start'});
    }

}
