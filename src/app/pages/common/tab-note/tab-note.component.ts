import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {GlobalVariablesService} from '../../../services/global-variables/global-variables.service';

@Component({
  selector: 'app-tab-note',
  templateUrl: './tab-note.component.html',
  styleUrls: ['./tab-note.component.css']
})
export class TabNoteComponent implements OnInit {

	@Input() itemData;
  @Output() saveJobNote: EventEmitter<any> = new EventEmitter;
  @Output() deleteJobNote: EventEmitter<any> = new EventEmitter;
	note = {
        id : null,
        note: '',
        isShared: true,
        isSharedEveryone: false
    }
  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;

  currentUser: any;

	constructor( private globalVar: GlobalVariablesService ) { }

	ngOnInit() {

    this.currentUser = this.globalVar.getCookieCurrentUser();
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      toolbar: [['Bold', 'Italic', 'Underline']]
    }

	}

	changeNote(event) {
	}

  saveNote(personID, note) {
    this.saveJobNote.emit({personID: personID, note: note});
  }

  loadNote(obj) {
    if (obj.id) {
      this.note = this.clone(obj);
    }
  }

  clone(obj) {
      return JSON.parse(JSON.stringify(obj));
  }

  cancelNote() {
    this.note = {
      id: null,
      note: '',
      isShared: true,
      isSharedEveryone: false
    }
  }

  deleteNote(id) {
    this.deleteJobNote.emit(id);
  }

}
