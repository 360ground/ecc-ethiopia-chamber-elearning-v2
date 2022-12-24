import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  public faq:any = [
    {
      title: 'How do I create an account ?',
      body: `
      To create an account, head to the signup page on the landing page and provide the necessary information. 
      You can register either as an individual which will enable you to enroll in courses personally or as an organization in order to submit a request to ECCSA for your workers to be enrolled.  
      `
    },
    {
      title: 'How do I enroll in a course ?',
      body: `
      To enroll in courses, find the course you wish to enroll into and simply click on “Take course”. If the course is a paid course, you will be prompted to make the necessary payments. If it is free, you simply may start learning.  `
    },
    {
      title: 'How can I view and edit my account profile ?',
      body: `
      To edit your profile, click on your profile name (Top right corner of the page) and select “Update my profile” this will allow you to edit your profile.
      `
    },
    {
      title: 'Will the answers I give during lectures be counted in my course evaluation ?',
      body: `
      No. Only the answers you give in the Case Studies will count in the course evaluations. Please note, however, that you must finish reading all lectures in a course in order to successfully complete the course
      `
    },
    {
      title: 'How can I view my progress in a course I am currently attempting ?',
      body: `
      To view your progress, just click at the Header  (My learning plan) the top the screen
      `
    },
    {
      title: 'Who can I contact if I have additional questions ?',
      body: `
      You can contact the Ethiopian Chamber Academy E-Learning support team by clicking on the "Contact Us'' button at the top of your screen, and specifying the type of your question. Your queries will be answered promptly. Please allow for longer response times during weekends.
      `
    },
    {
      title: 'The web page seems to get stuck when I try to log in. What should I do ?',
      body: `
      If the web page gets stuck, try hitting the "Back" button on your web browser and refreshing the page. If the problem persists, try updating your web browser to a newer version.
      `
    },
    {
      title: 'The lectures do not show. What should I do ?',
      body: `
      If necessary, please restart the Internet browser you are currently using. All Ethiopian Chamber Academy course videos are currently streamed from the website www.youtube.com. Alternatively, please refer to the PDF copies of each lecture, Make sure that your computer is able to view videos from this website.
      `
    },
   
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
