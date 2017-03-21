import { Injectable, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { NoteForwardComponent } from '../../shared/note-forward/note-forward.component';

import { DbMainmenu } from './../../services/backend/db-models/portal';
import { DocumentComponent } from '../../shared/forms/document/document.component';
import { EventComponent } from '../../shared/forms/event/event.component';
import { NoteComponent } from '../../shared/forms/note/note.component';
import { ObjectiveComponent } from '../../shared/forms/objective/objective.component';

@Injectable()
export class FormsDialogService {

  constructor(private dialog: MdDialog) { }

  public openNoteForwarding(note: any): Observable<string> {

    let dialogRef: MdDialogRef<NoteForwardComponent>;

    dialogRef = this.dialog.open(NoteForwardComponent);
    dialogRef.componentInstance.note = note;

    return dialogRef.afterClosed();
  }

  public openDocumentForm(params: any) {
    let dialogRef: MdDialogRef<DocumentComponent>;
    let config: MdDialogConfig = new MdDialogConfig();

    config.disableClose = true;

    dialogRef = this.dialog.open(DocumentComponent, config);
    dialogRef.componentInstance.viewId = params.viewId ? params.viewId : null;
    dialogRef.componentInstance.contentId = params.contentId ? params.contentId : null;
    dialogRef.componentInstance.id = params.docId ? params.docId : null;

    return dialogRef.afterClosed();
  }

}
