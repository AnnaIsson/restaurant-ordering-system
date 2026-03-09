// ============================================================
// HighlightDirective - Highlights recommended/discounted items
// ============================================================
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: 'recommended' | 'discounted' | 'new' | '' = '';
  @Input() isActive: boolean = true;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.isActive) return;

    switch (this.appHighlight) {
      case 'recommended':
        this.renderer.addClass(this.el.nativeElement, 'highlight-recommended');
        break;
      case 'discounted':
        this.renderer.addClass(this.el.nativeElement, 'highlight-discounted');
        break;
      case 'new':
        this.renderer.addClass(this.el.nativeElement, 'highlight-new');
        break;
    }
  }
}
