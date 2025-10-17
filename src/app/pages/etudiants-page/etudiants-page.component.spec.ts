import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantsPageComponent } from './etudiants-page.component';

describe('EtudiantsPageComponent', () => {
  let component: EtudiantsPageComponent;
  let fixture: ComponentFixture<EtudiantsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtudiantsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
