import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HeaderComponent } from './shared/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'dokkan_ost';
  lwfInstance: any;
  lwfInstance2: any;
  showArtwork = signal(true);
  @ViewChild('cardArtwork', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cardIntro', { static: false })
  canvasIntro!: ElementRef<HTMLCanvasElement>;
  @ViewChild('audio', { static: false })
  audioRef!: ElementRef<HTMLAudioElement>;

  previousTick = 0;
  private spinner = inject(NgxSpinnerService);
  ngAfterViewInit() {
    // const canvas = this.canvasRef.nativeElement;
    // // Vérifiez si le canvas existe
    // if (!canvas) {
    //   console.error('Canvas non trouvé');
    //   return;
    // }
    // // Utiliser LWF pour initialiser l'animation
    // LWF.useCanvasRenderer();
    // LWF.ResourceCache.get().loadLWF({
    //   lwf: 'card_1022380.lwf',
    //   prefix: './cards/card/',
    //   stage: canvas,
    //   onload: (loadedLwfInstance: any) => {
    //     this.lwfInstance = loadedLwfInstance;
    //     this.canvasRef.nativeElement.classList.add('artwork');
    //     this.animate();
    //   },
    //   onerror: (error: any) => {
    //     console.error('Erreur lors du chargement de LWF :', error);
    //   },
    // });
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

  playAnimation() {
    this.showArtwork.set(false);

    // Exemple de lecture audio
    // const audio = this.audioRef.nativeElement;
    // if (audio) {
    //   audio.volume = 0.03;
    //   audio.loop = true;
    //   audio.play();
    // }
    const canvas = this.canvasRef.nativeElement;

    LWF.ResourceCache.get().loadLWF({
      lwf: 'sp_effect_b4_00215.lwf',
      prefix: './intro/sp_effect_b4_00215/',
      stage: canvas,
      onload: (loadedLwfInstance: any) => {
        this.lwfInstance = loadedLwfInstance;
        this.canvasRef.nativeElement.classList.remove('artwork');
        this.canvasRef.nativeElement.classList.add('intro');

        // Si vous devez attacher une animation spécifique
        const attachedMovie = this.lwfInstance.rootMovie.attachMovie(
          'ef_001',
          'battle',
          1
        );
        if (attachedMovie) {
          // attachedMovie.play();

          // Centrer la scène
          attachedMovie.moveTo(
            this.lwfInstance.width / 1.5,
            this.lwfInstance.height / 2
          );

          // // Ajuster la mise à l'échelle
          attachedMovie.scaleX = 2; // Modifier la valeur pour ajuster
          attachedMovie.scaleY = 1.3;
          this.lwfInstance.scaleForHeight(canvas.width, canvas.height);
        }

        // Relancer le cycle d'animation
        // this.animate();
      },
      onerror: (error: any) => {
        console.error('Erreur lors du chargement de LWF :', error);
      },
    });

    // animate()
  }
}
