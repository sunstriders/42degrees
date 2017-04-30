import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    selector: 'about-us-dialog',
    templateUrl: './about-us-dialog.html',
})
export class AboutUsDialogComponent {
    constructor(public dialogRef: MdDialogRef<AboutUsDialogComponent>) {}
}
