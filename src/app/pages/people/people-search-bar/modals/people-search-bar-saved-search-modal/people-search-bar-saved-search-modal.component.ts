import { Component, OnInit, Input, ViewChild, EventEmitter } from '@angular/core';

import {NgxSpinnerService} from 'ngx-spinner';

import {GlobalVariablesService} from '../../../../../services/global-variables/global-variables.service';
import {RekrutiApiService} from '../../../../../services/api/api.service';
import {SearchService} from '../../../../../services/search/search.service';
import {NotificationsService} from '../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-people-search-bar-saved-search-modal',
  templateUrl: './people-search-bar-saved-search-modal.component.html',
  styleUrls: ['./people-search-bar-saved-search-modal.component.css']
})
export class PeopleSearchBarSavedSearchModalComponent implements OnInit {
  
  listData: any;
  hasAlert: any = true;
  @ViewChild('btn_cancel') btnCancel;

  constructor(private globalVar: GlobalVariablesService,
              private api: RekrutiApiService,
              private spinner: NgxSpinnerService,
              private search: SearchService,
              private notifications: NotificationsService) { }

  ngOnInit() {
    this.globalVar.openSavedSearchModalEvent.subscribe(() => {
      this.getListData();
    });
  }

  getListData() {
    this.api.getListData().then(
      response => {
        if(response.result > 0){
          this.listData = response.data;
        } else {
          console.log('res-err:', response);
        }
      },
      err => {
        console.log('err:', err);
      });
  }

  gotoSearch(queryJson){
    this.btnCancel.nativeElement.click();
    this.globalVar.peopleListChanged(queryJson);
  }

  delete(objId){
    this.api.deleteSavedSearch(objId).then(
      response => {
        if(response.result > 0){
          this.notifications.success('Deleted successfully!', 1000);
        } else {
          this.notifications.warning('Can not delete!', 1000);
        }
        this.btnCancel.nativeElement.click();
      },
      err => {
        this.notifications.warning('Error!', 1000);
        console.log('err:', err);
        this.btnCancel.nativeElement.click();
      });
  }

  setIsNotify(savedSearchId, isNotify){
    this.api.setIsNotify(savedSearchId, isNotify).then(
      response => {
        if(response.result > 0){
          this.notifications.success('Alerts activated!', 1000);
        } else {
          this.notifications.warning('Alerts deactivated!', 1000);
        }
        this.btnCancel.nativeElement.click();
      },
      err => {
        this.notifications.warning('Error!', 1000);
        console.log('err:', err);
        this.btnCancel.nativeElement.click();
      });
  }

}
