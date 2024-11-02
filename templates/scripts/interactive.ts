interface ChartModalOptions {
  src: string;
  title: string | undefined;
}

class ReportInteractions {
  constructor() {
    this.initializeComparisons();
    this.initializeFilters();
    this.initializeExpandables();
    this.initializeChartInteractions();
  }

  private initializeComparisons(): void {
    document.querySelectorAll('.comparison-container').forEach(container => {
      const img = container.querySelector('img');
      if (!img) return;

      const slider = document.createElement('input');
      
      Object.assign(slider, {
        type: 'range',
        min: '0',
        max: '100',
        value: '50',
        className: 'comparison-slider'
      });

      slider.addEventListener('input', (e) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        img.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      });

      container.appendChild(slider);
    });
  }

  private initializeFilters(): void {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-controls';
    
    const severities = ['all', 'high', 'medium', 'low'] as const;
    severities.forEach(severity => {
      const button = document.createElement('button');
      button.className = 'severity-filter';
      button.textContent = severity.charAt(0).toUpperCase() + severity.slice(1);
      button.dataset.severity = severity;
      
      button.addEventListener('click', () => this.filterIssues(severity));
      filterContainer.appendChild(button);
    });

    const issuesList = document.querySelector('.issues-list');
    issuesList?.parentElement?.insertBefore(filterContainer, issuesList);
  }

  private filterIssues(severity: string): void {
    document.querySelectorAll('.issue').forEach(issue => {
      issue.style.display = severity === 'all' || 
        issue.classList.contains(severity) ? 'block' : 'none';
    });

    document.querySelectorAll('.severity-filter').forEach(button => {
      if (button instanceof HTMLElement) {
        button.classList.toggle('active', button.dataset.severity === severity);
      }
    });
  }

  private initializeExpandables(): void {
    document.querySelectorAll('.analysis-card h3').forEach(header => {
      if (header instanceof HTMLElement) {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
          header.parentElement?.classList.toggle('expanded');
        });
      }
    });
  }

  private initializeChartInteractions(): void {
    document.querySelectorAll('.chart-container').forEach(container => {
      const img = container.querySelector('img');
      if (!img) return;

      img.addEventListener('click', () => {
        this.showChartModal({
          src: img.src,
          title: container.querySelector('h3')?.textContent
        });
      });
    });
  }

  private showChartModal({ src, title }: ChartModalOptions): void {
    const modal = document.createElement('div');
    modal.className = 'chart-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>${title || 'Chart Detail'}</h3>
        <img src="${src}" alt="${title}" />
        <button class="close-modal">Close</button>
      </div>
    `;

    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        modal.remove();
      });
    }

    document.body.appendChild(modal);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ReportInteractions();
}); 