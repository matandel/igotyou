import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  @Input() public isModalOpen: boolean = false
  @Input() public message: string = ''
  @Output() public confirmationEmitter: EventEmitter<void> =
    new EventEmitter()
  @Output() public closeModalEmitter: EventEmitter<void> =
    new EventEmitter()

  constructor() {}

  public ngOnInit(): void {}

  public closeModal(): void {
    this.closeModalEmitter.emit()
  }

  public confirmAction(): void {
    this.confirmationEmitter.emit()
  }
}
