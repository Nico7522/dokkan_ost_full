import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { CardsService } from '../../../services/cards/cards.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CardComponent } from '../../../shared/card/card.component';
import { keysToCamel } from '../../../helpers/helpers';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [AsyncPipe, CardComponent],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss',
})
export class CardDetailsComponent {
  private readonly cardService = inject(CardsService);
  private readonly spinnerService = inject(NgxSpinnerService);
  lwfInstance: any;
  ostText = signal('Play OST');
  thumb = signal(0);
  @ViewChild('cardArtwork', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('audio', { static: false })
  audioRef!: ElementRef<HTMLAudioElement>;
  id = input<string>('');
  card$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.cardService.getCardById(+id).pipe(
        tap((x) => this.thumb.set(x.thumb)),
        map((card) => {
          this.spinnerService.show('loader');
          return keysToCamel(card);
        })
      );
    })
  );

  loadArtwork() {
    setTimeout(() => {
      console.log(this.thumb());
      const canvas = this.canvasRef.nativeElement;
      // Vérifiez si le canvas existe
      if (!canvas) {
        console.error('Canvas non trouvé');
        return;
      }
      // Utiliser LWF pour initialiser l'animation
      LWF.useCanvasRenderer();
      LWF.ResourceCache.get().loadLWF({
        lwf: `card_${this.thumb().toString()}.lwf`,
        prefix: './artworks/' + this.thumb().toString() + '/',

        stage: canvas,
        onload: (loadedLwfInstance: any) => {
          this.lwfInstance = loadedLwfInstance;
          this.canvasRef.nativeElement.classList.add('artwork-anim');
          console.log(this.lwfInstance);
          const attachedMovie = this.lwfInstance.rootMovie.attachMovie(
            'ef_001',
            'battle',
            0
          );
          if (attachedMovie) {
            attachedMovie.moveTo(
              this.lwfInstance.width / 2,
              this.lwfInstance.height / 2
            );
          }
          this.lwfInstance.width / 1.5, this.lwfInstance.height / 2;
          this.animate();
        },
        onerror: (error: any) => {
          console.error('Erreur lors du chargement de LWF :', error);
        },
      });
    }, 500);
  }
  previousTick = 0;
  ngAfterViewInit() {
    this.loadArtwork();
    this.spinnerService.hide('loader');
  }

  getDelta() {
    const now = Date.now() / 1000;
    const delta = now - this.previousTick;
    this.previousTick = now;
    return delta;
  }

  animate = () => {
    if (this.lwfInstance) {
      this.lwfInstance.exec(this.getDelta());
      this.lwfInstance.render();
    }
    requestAnimationFrame(this.animate);
  };

  playOst() {
    const audio = this.audioRef.nativeElement;

    if (audio && this.ostText() === 'Play OST') {
      audio.volume = 0.03;
      audio.loop = true;
      audio.play();
      this.ostText.set('Pause OST');
    } else {
      audio.volume = 0.03;
      audio.loop = true;
      audio.pause();
      this.ostText.set('Play OST');
    }
  }
}
