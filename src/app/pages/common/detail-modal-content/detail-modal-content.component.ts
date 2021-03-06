import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {RekrutiApiService} from '../../../services/api/api.service';
import {NotificationsService} from '../../../services/notifications/notifications.service';
import {GlobalVariablesService} from '../../../services/global-variables/global-variables.service';

declare var $: any;

@Component({
  selector: 'app-detail-modal-content',
  templateUrl: './detail-modal-content.component.html',
  styleUrls: ['./detail-modal-content.component.css']
})
export class DetailModalContentComponent implements OnInit, AfterViewInit {

	@Input() type = 'people';
	@Input() itemData : any;
  @Input() chosenTab : any;
  @Input() fromFull;

  @ViewChild('tab') ngbTabSet;

	jobReq: any = {
		list: [],
        sharedList: '',
        isAdding: false,
        newName: ''
	}
	selectedTabStatus = [false, false, false, false, false];
    

	constructor(private api: RekrutiApiService, 
              private notifications: NotificationsService, 
              private cdRef:ChangeDetectorRef, 
              private globalVar: GlobalVariablesService) { }

	ngOnInit() {
        this.globalVar.refreshJobReqTabEvent.subscribe(() => {
            this.loadJobReqs(this.itemData.id);
        });

        this.globalVar.refreshDocumentTabEvent.subscribe(() => {
            this.loadDocument(this.itemData.id);
        });
        // this.ngAfterViewInit();
        this.globalVar.openPeopleTabModalEvent.subscribe((data: any) => {
          console.log('tab-03', data);
          this.itemData = data.item;
          this.chosenTab = data.tabName;
          this.tabInit(data);
        });
        console.log('tab-00', this.chosenTab);
        
          
  }

  ngAfterViewInit() {
    if (this.chosenTab != null && this.chosenTab !== "") {
        
        switch (this.chosenTab) {
            case "contact":
                this.ngbTabSet.select('tab1');
                break;
            case "note":
                this.loadJobNotes(this.itemData.id);
                this.ngbTabSet.select('tab3');
                break;
            case "jobReq":
                this.loadJobReqs(this.itemData.id);
                this.ngbTabSet.select('tab2');
                break;
            default:
                this.ngbTabSet.select('tab0');
                break;
        }

        this.cdRef.detectChanges();
    }
  }

  tabInit(data) {
    console.log('asas:', data);
      if (data.tabName != null && data.tabName !== "") {
          switch (data.tabName) {
              case "contact": 
                  this.ngbTabSet.select('tab1');
                  break;
              case "note":
                  this.loadJobNotes(this.itemData.id);
                  this.ngbTabSet.select('tab3');
                  break;
              case "jobReq":
                  this.loadJobReqs(this.itemData.id);
                  this.ngbTabSet.select('tab2');
                  break;
              default:
                  this.ngbTabSet.select('tab0');
                  break;
          }

          this.cdRef.detectChanges();
      }
  }

	setTab(event) {
		switch (event.nextId) {
			case "tab2":
				this.loadJobReqs(this.itemData.id);
				break;
			case "tab3" : 
				this.loadJobNotes(this.itemData.id);
				break;
      case "tab4" :
          this.loadDocument(this.itemData.id);
          break;
			default:
				// code...
				break;
		}
	}

	openFullPage(personId) {
		
	}

    saveJobNote(event) {
        this.api.person_saveJobNote(event)
        .then(response => {
            
                if (response.result > 0) {
                    
                    this.notifications.success('Saved!', 5000);
                    this.loadJobNotes(event.personID);
                    
                } else {
                    this.notifications.warning(response.message, 10000);
                }
            },
            err => {
                console.log(err);
                this.notifications.warning('Error', 10000);
            }
        )
    }

	loadJobReqs(personId) {
		this.api.person_jobList(personId)
        .then(response => {
            
                if (response.result > 0) {
                    
                    this.jobReq.list = response.data;
                    
                } else {
                    this.notifications.warning(response.message, 10000);
                }
            },
            err => {
                console.log(err);
               
            }
        )

        this.loadJobSharedList(personId);
	}

	loadJobSharedList(personId) {

		this.api.person_jobSharedList(personId)
        .then(response => {
            
                if (response.result > 0) {
                    
                    this.jobReq.sharedList = response.data;
                    
                } else {
                    this.notifications.warning(response.message, 10000);
                }
            },
            err => {
                console.log(err);
                
            }
        )
	}

	loadJobNotes(personId) {
		this.api.person_jobNote(personId)
        .then(response => {
            
                if (response.result > 0) {
                    
                    
                    this.itemData.notes = response.data;
                    
                } else {
                    this.notifications.warning('error', 10000);
                }
            },
            err => {
                console.log(err);
                
            }
        )
	}

    loadDocument(personId) {
        this.api.person_document(personId)
        .then(response => {
            
                if (response.result > 0) {
                    
                    
                    this.itemData.documents = response.data;
                    
                } else {
                    this.notifications.warning('error', 10000);
                }
            },
            err => {
                console.log(err);
                
            }
        )
    }

    deleteJobNote(event: any) {
        this.api.person_deleteNOte(event)
        .then(response => {
            
               if (response.result > 0) {
                    
                    this.notifications.success('Deleted!', 5000);
                    this.loadJobNotes(this.itemData.id);
                    
                } else {
                    this.notifications.warning(response.message, 10000);
                }
            },
            err => {
                console.log(err);
                this.notifications.warning('Error', 10000);
            }
        )
    }

    addNewJobReq(event: any) {
        this.api.person_addJob(event)
        .then(response => {
            
               if (response.result > 0) {
                    
                    this.setJobReq({personID: event.personID, jobReqID: response.result, check: true})
                    this.loadJobReqs(event.personID);
                    this.notifications.success('Added', 5000);
                    this.jobReq.isAdding = false;
                } else {
                    this.notifications.warning(response.message, 10000);
                }
            },
            err => {
                console.log(err);
                this.notifications.warning('Error', 10000);
            }
        )
    }

    setJobReq(data: any) {
        this.api.person_setJobReq(data)
        .then(response => {
            
               if (response.result > 0) {
                    
                    if (data.check) {
                        this.notifications.success('Added to Job Req', 5000);
                    } else {
                        this.notifications.success('Removed from Job Req', 5000);
                    }                    
                    
                } else {
                    this.notifications.warning(response.message, 10000);
                }
            },
            err => {
                console.log(err);
                this.notifications.warning('Error', 10000);
            }
        )
    }

}
