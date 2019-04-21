import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faChevronUp, faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'garage-paginator',
  templateUrl: './paginator.component.pug',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  public pageUpIcon: IconDefinition = faChevronUp;
  public pageDownIcon: IconDefinition  = faChevronDown;
  private $limit = 0;
  private $startIndex = 1;
  private $total = 0;

  @Input()
  public get limit(): number {
    return this.$limit;
  }
  public set limit(limit: number) {
    this.$limit = parseInt(`${limit}`, 10);
  }

  @Input()
  public get total(): number {
    return this.$total;
  }
  public set total(total: number) {
    this.$total = parseInt(`${total}`, 10);
    this.navigate.emit({start: this.startIndex - 1, end: this.endIndex});
  }

  public get startIndex(): number {
    return this.$startIndex;
  }
  public set startIndex(index: number) {
    this.$startIndex = index;
    this.navigate.emit({start: index - 1, end: this.endIndex});
  }

  public get endIndex(): number {
    return Math.min(this.startIndex + this.limit - 1, this.total);
  }

  @Output() public navigate: EventEmitter<{start: number, end: number}> = new EventEmitter<{start: number, end: number}>();

  constructor() { }

  scrollUp() {
    if (this.startIndex > 1) {
      this.startIndex = Math.max(this.startIndex - this.limit, 1);
    }
  }

  scrollDown() {
    if (this.endIndex < this.total) {
      this.startIndex = Math.min(this.startIndex + this.limit, this.total - this.limit + 1);
    }
  }

  ngOnInit() {
    this.startIndex = 1;
  }

}
