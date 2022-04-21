import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() control: FormControl = new FormControl;
  @Input() type = 'text'
  @Input() placeholder = ''


  constructor() { }

  ngOnInit(): void {
  }

  get errorMinLength() {
    const controlError = this.control.errors?.['minlength']
    return `The number of character is ${controlError.actualLength} and it must be  ${controlError.requiredLength}.`
  }
}
