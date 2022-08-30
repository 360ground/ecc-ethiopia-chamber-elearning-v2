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
    this.getGetQuizes();
  }

  getGetQuizes() {
    this.isLoading = true;

    const formData = new FormData();

    formData.append('wstoken', this.service.token);
    formData.append('wsfunction', 'mod_quiz_get_attempt_data');
    formData.append('moodlewsrestformat', 'json');
    formData.append('attemptid', '48');
    formData.append('page', '0');

    this.service.main(formData).subscribe((response: any) => {
      this.quizes = response.questions;

      this.quizes.forEach((element) => {
        let settings = JSON.parse(element.settings);

        element.html = JSON.parse(element.html);
        element.html.answers = Object.values(element.html.answers);
        element.selectedAnswer = null;

        if (+settings.shuffleanswers) {
          element.html.answers = element.html.answers.sort(
            (a: any, b: any) => 0.5 - Math.random()
          );
        }
      });
    });
  }

  selectAnswer(index: any, value: any) {
    this.quizes[index].selectedAnswer = value;
  }
}
