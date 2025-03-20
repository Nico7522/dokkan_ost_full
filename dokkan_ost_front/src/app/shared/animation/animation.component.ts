import { Component, ElementRef, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-animation',
  standalone: true,
  imports: [],
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss',
})
export class AnimationComponent {
  previousTick = 0;
  lwfInstance: any;
  body = document.querySelector('body') as HTMLBodyElement;
  @ViewChild('cardIntro', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
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
    // Exemple de lecture audio
    // const audio = this.audioRef.nativeElement;
    // if (audio) {
    //   audio.volume = 0.03;
    //   audio.loop = true;
    //   audio.play();
    // }
    // this.loadAnimation();
    // animate();
  }

  ngAfterViewInit() {
    this.body.classList.add('no-scroll');
    this.loadAnimation();
  }

  ngOnDestroy() {
    this.body.classList.remove('no-scroll');
  }

  loadAnimation() {
    setTimeout(() => {
      if (this.canvasRef) {
        const canvas = this.canvasRef.nativeElement;
        // Vérifiez si le canvas existe
        if (!canvas) {
          console.error('Canvas non trouvé');
          return;
        }
        // Utiliser LWF pour initialiser l'animation
        LWF.useCanvasRenderer();
        LWF.ResourceCache.get().loadLWF({
          lwf: 'sp_effect_b4_00215.lwf',
          prefix: './intro/sp_effect_b4_00215/',

          stage: canvas,
          onload: (loadedLwfInstance: any) => {
            this.lwfInstance = loadedLwfInstance;
            this.canvasRef?.nativeElement.classList.add('intro');
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
      }
    }, 500);
  }
}
