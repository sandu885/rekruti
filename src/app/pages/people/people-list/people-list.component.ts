import { Component, OnInit, ViewChildren } from '@angular/core';
import { environment } from "../../../../environments/environment";

import {PaginationInstance} from 'ngx-pagination';

import { GlobalVariablesService } from '../../../services/global-variables/global-variables.service';
import { SearchService } from '../../../services/search/search.service';

declare var $:any;
import * as _ from "lodash";

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {
    
    @ViewChildren('list') listItems: any;
    
    urlImg:any = environment.endpoint + '/personDocument/wDownload?storeGuid=';
    
    public maxSize: number = 8;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public responsive: boolean = false;
    public config: PaginationInstance = {
        id: 'server',
        itemsPerPage: 20,
        currentPage: 1
    };
    public labels: any = {
        previousLabel: 'Previous',
        nextLabel: 'Next',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page'
    };
    
    currentUserData:any;
    peopleData:any = {};
    peopleList:any = [];
    searchAggregations:any = [];
    currentActiveItemInPeopleList:any;
    hasBucketSelected:any;
    searchSort:any;
    
    searchSortArray:any = [];

    constructor(private globalVar:GlobalVariablesService, private search:SearchService) {
        this.peopleData = {
            total:0,
            hits:[] 
        }
        this.currentActiveItemInPeopleList = {
            id:null
        }
        this.searchSortArray = [
            { value: 'lastUpdate', label: 'Last Update' },
            { value: 'readyForChangeIndex', label: 'Ready For Change Index' },
            { value: 'relocationIndex', label: 'Relocation Index' },
        ];
    }

    ngOnInit() {
        this.currentUserData = this.globalVar.getCookieCurrentUser();
        
        this.globalVar.peopleListEvent.subscribe((list:any) => {
            this.searchSort = list.data.sort;
            this.peopleData = list.data;
            this.searchAggregations = list.data.aggregations;
            this.peopleList = this.peopleData.hits;
            this.config.currentPage = this.globalVar.getCurrentPagePeople();
            this.hasBucketSelected = this.search.hasBucketSelected(list.data.aggregations);
        });
        
        $('#detailsModal').on('hide.bs.modal', (e=> {
            for (var i = 0; i < this.listItems._results.length; i++) {
                this.listItems._results[i].nativeElement.className = "people-list-td";
            }
        }));
    }
    
    updatePeopleList(body:any) {
        this.globalVar.setCurrentPagePeople(this.config.currentPage);
        this.globalVar.peopleListChanged(body);
        this.globalVar.scrollContentToTopPeople();
    }
    
    onPageChange(number: number) {
        this.config.currentPage = number;
        var start = this.calcFromWhichItem(number);
        var currentActiveFilters = this.globalVar.getSearchQueryPeople();
        currentActiveFilters.from = start;
        this.updatePeopleList(currentActiveFilters);
    }
    
    calcFromWhichItem(page: number):any {
        return (page - 1) * this.config.itemsPerPage;
    }
    
    openDetailsModal(item:any) {
        this.currentActiveItemInPeopleList = item;
    }
    
    checkActiveItem(id:any) {
        if(this.currentActiveItemInPeopleList.id === id)
            return 'active';
        return '';
    }
    
    searchSortMain() {
        this.config.currentPage = 1;
        var body = this.search.setSort(this.globalVar.getSearchQueryPeople(), this.searchSort);
        this.globalVar.setSearchConditionsPeople(body);
        this.updatePeopleList(body);
    }
    
    removeBucket(bucket:any) {
        this.globalVar.peopleListChanged(this.search.removeBucket(bucket, this.globalVar.getSearchConditionsPeople()));
    }
    
    clearSearch() {
        this.globalVar.peopleListChanged(this.search.clearSearch());
    }
}
