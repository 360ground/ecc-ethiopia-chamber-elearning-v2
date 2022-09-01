import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizes',
  templateUrl: './quizes.component.html',
  styleUrls: ['./quizes.component.css'],
})
export class QuizesComponent implements OnInit {
  public quizzes: any[] = [];
  public attempts: any[] = [];
  public isLoading: Boolean = false;
  public state: any;
  public detail: any;

  constructor(
    public location: Location,
    public service: ApiService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.state = this.location.getState();
    this.getQuizes();
  }

  getQuizes() {
    this.isLoading = true;

    const formData = new FormData();

    formData.append('wstoken', this.service.token);
    formData.append('wsfunction', 'mod_quiz_get_quizzes_by_courses');
    formData.append('moodlewsrestformat', 'json');
    formData.append('courseids[0]', this.state.courseId);

    this.service.main(formData).subscribe((response: any) => {
      this.quizzes = response.quizzes;

      this.quizzes.forEach(async (element: any) => {
        await this.getAttempts(element);
      });
      this.isLoading = false;
    });
  }

  getAttempts(element: any): any {
    const formData = new FormData();

    formData.append('wstoken', this.service.token);
    formData.append('wsfunction', 'mod_quiz_get_user_attempts');
    formData.append('moodlewsrestformat', 'json');
    formData.append('quizid', element.id);
    formData.append('userid', this.service.userData.id);
    formData.append('status', 'all');

    this.service.main(formData).subscribe((response: any) => {
      if (response.attempts.length) {
        element.attempts = response.attempts;
      } else {
        this.startNewAttempt(element);
      }
    });
  }

  startNewAttempt(element: any) {
    const formData = new FormData();

    formData.append('wstoken', this.service.token);
    formData.append('wsfunction', 'mod_quiz_start_attempt');
    formData.append('moodlewsrestformat', 'json');
    formData.append('quizid', element.id);

    this.service.main(formData).subscribe((response: any) => {
      element.attempts = response.attempts;
    });
  }

  navigate(attemptid: any) {
    if (confirm(`are you sure want to open this quiz ?`)) {
      this.state.attemptid = attemptid;
      this.router.navigate(['/quizes/start'], { state: { data: this.state } });
    }
  }
}
