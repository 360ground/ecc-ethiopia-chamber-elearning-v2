import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quize',
  templateUrl: './quize.component.html',
  styleUrls: ['./quize.component.css'],
})
export class QuizeComponent implements OnInit {
  public quizes: any[] = [];
  public isLoading: Boolean = false;
  public adminToken: any = environment.adminToken;
  public state: any;

  constructor(public location: Location, public service: ApiService) {}

  public detail: any;

  ngOnInit(): void {
    this.state = this.location.getState();
    console.log(this.state);
    this.getGetQuizes();
  }

  getGetQuizes() {
    this.isLoading = true;

    const formData = new FormData();

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'mod_quiz_get_questions_as_json');
    formData.append('moodlewsrestformat', 'json');
    formData.append('courseid', this.state.id);

    this.service.main(formData).subscribe((response: any) => {
      this.quizes = response.questions;
      console.log(this.quizes);
    });
  }
}
