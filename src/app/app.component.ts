import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Rekruti';
    
    
    constructor() {
        
    }
    
    onDeactivate() {
        document.body.scrollTop = 0;
    }
}
