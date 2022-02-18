import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { SaveTemplateModalComponent } from './save-template-modal.component'

describe('SaveTemplateModalComponent', () => {
  let component: SaveTemplateModalComponent
  let fixture: ComponentFixture<SaveTemplateModalComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SaveTemplateModalComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents()

      fixture = TestBed.createComponent(SaveTemplateModalComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
    }),
  )

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
