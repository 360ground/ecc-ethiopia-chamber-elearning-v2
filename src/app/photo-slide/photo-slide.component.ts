import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbModalConfig, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-photo-slide',
  templateUrl: './photo-slide.component.html',
  styleUrls: ['./photo-slide.component.css']
})
export class PhotoSlideComponent implements OnInit {
  public baseImageUrl: any = environment.baseUrlBackend;

  @ViewChild('carousel', { static: true })
  carousel!: NgbCarousel;


	public paused = false;
	public unpauseOnArrow = false;
	public pauseOnIndicator = false;
	public pauseOnHover = true;
	public pauseOnFocus = true;

  constructor(
    public config: NgbModalConfig,
    public service: ApiService
  ) { }

  ngOnInit(): void {
  }

  togglePaused() {
		if (this.paused) {
			this.carousel.cycle();
		} else {
			this.carousel.pause();
		}
		this.paused = !this.paused;
	}

	onSlide(slideEvent: NgbSlideEvent) {
		if (
			this.unpauseOnArrow &&
			slideEvent.paused &&
			(slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
		) {
			this.togglePaused();
		}
		if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
			this.togglePaused();
		}
	}

}
