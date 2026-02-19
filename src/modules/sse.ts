import { fromBase64, randomString } from "@xxanderwp/jstoolkit";

export class SseClass {
  private source!: EventSource;

  private path: string;

  private _OnData: {
    id: string;
    event: string;
    handle: (...args: any[]) => void;
  }[] = [];

  OnData(event: string, handle: (...args: any[]) => void) {
    const id = randomString(5);

    this._OnData.push({ id, event, handle });

    return {
      Remove: () => {
        this._OnData = this._OnData.filter(q => q.id !== id);
      },
    };
  }

  private Init() {
    const isBrowser =
      typeof window !== 'undefined' &&
      typeof window.EventSource !== 'undefined';

    if (!isBrowser) {
      return;
    }

    this.source = new EventSource(`/api/sse/${this.path}`);

    this.source.onmessage = event => {
      if (event.data) {
        const [name, ...args] = JSON.parse(fromBase64(event.data));

        this._OnData.forEach(q => {
          if (q.event === name) {
            q.handle(...args);
          }
        });
      }
    };
  }

  constructor(path: string) {
    this.path = path;

    setTimeout(() => {
      this.Init();
    }, 3000);
  }
}

export const SsePublic = new SseClass('public');
