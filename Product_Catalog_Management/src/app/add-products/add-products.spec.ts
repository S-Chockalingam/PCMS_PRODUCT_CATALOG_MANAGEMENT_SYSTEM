import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProducts } from './add-products';

describe('AddProducts', () => {
  let component: AddProducts;
  let fixture: ComponentFixture<AddProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
