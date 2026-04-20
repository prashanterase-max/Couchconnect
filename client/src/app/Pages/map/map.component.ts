import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ProfileService } from '../../core/services/profile.service';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  template: `
    <app-navbar />
    <div style="padding-top:64px;height:100vh;display:flex;flex-direction:column;">

      <!-- Toolbar -->
      <div class="map-toolbar">
        <div style="display:flex;gap:8px;align-items:center;flex:1;max-width:360px;">
          <div style="position:relative;flex:1;">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;pointer-events:none;">🔍</span>
            <input [(ngModel)]="searchCity" placeholder="Search any city..." class="map-search" style="padding-left:36px;" (keyup.enter)="flyToCity()" />
          </div>
          <button class="btn-primary" style="padding:9px 18px;white-space:nowrap;" (click)="flyToCity()" [disabled]="searching">
            {{ searching ? '...' : 'Go' }}
          </button>
        </div>

        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <div style="display:flex;gap:3px;background:#f0f0f0;border-radius:8px;padding:3px;">
            <button *ngFor="let s of mapStyles" (click)="setStyle(s)"
              style="padding:5px 12px;border-radius:6px;border:none;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;"
              [style.background]="currentStyle===s.id?'#fff':'transparent'"
              [style.color]="currentStyle===s.id?'#e8472a':'#555'"
              [style.box-shadow]="currentStyle===s.id?'0 1px 4px rgba(0,0,0,0.1)':''">{{s.label}}</button>
          </div>
          <button (click)="toggle3D()" class="map-ctrl-btn" [class.active]="is3D">🏙️ 3D</button>
          <button (click)="toggleTerrain()" class="map-ctrl-btn" [class.active]="hasTerrain">⛰️ Terrain</button>
          <button (click)="locateMe()" class="map-ctrl-btn" title="My location">📍 Locate Me</button>
          <button (click)="sidePanel=!sidePanel" class="map-ctrl-btn" [class.active]="sidePanel">👥 Locals</button>
        </div>
      </div>

      <!-- Map + side panel -->
      <div style="flex:1;display:flex;overflow:hidden;position:relative;">

        <!-- Map -->
        <div id="maplibre" style="flex:1;"></div>

        <!-- Side panel -->
        <div class="side-panel" [class.open]="sidePanel">
          <div class="panel-header">
            <div>
              <div style="font-size:15px;font-weight:800;color:#1a1a1a;">Local Hosts</div>
              <div style="font-size:12px;color:#888;margin-top:2px;">{{locals.length}} found worldwide</div>
            </div>
            <button (click)="sidePanel=false" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:18px;padding:4px;">✕</button>
          </div>

          <!-- Stats row -->
          <div class="panel-stats">
            <div class="pstat">
              <div class="pstat-num" style="color:#22c55e;">{{locals.length}}</div>
              <div class="pstat-label">Locals</div>
            </div>
            <div class="pstat">
              <div class="pstat-num" style="color:#3b82f6;">{{uniqueCities}}</div>
              <div class="pstat-label">Cities</div>
            </div>
            <div class="pstat">
              <div class="pstat-num" style="color:#e8472a;">{{verifiedCount}}</div>
              <div class="pstat-label">Verified</div>
            </div>
          </div>

          <!-- Search within panel -->
          <div style="padding:0 14px 10px;">
            <input [(ngModel)]="panelSearch" placeholder="Filter by name or city..." style="font-size:13px;padding:8px 12px;border-radius:8px;border:1px solid #eee;background:#f7f7f8;width:100%;outline:none;" (ngModelChange)="filterLocals()" />
          </div>

          <!-- Local list -->
          <div class="panel-list">
            <div *ngIf="filteredLocals.length===0" style="text-align:center;padding:32px;color:#aaa;font-size:13px;">
              <div style="font-size:32px;margin-bottom:8px;">🌍</div>
              No locals found
            </div>
            <div *ngFor="let l of filteredLocals" class="panel-item" (click)="flyToLocal(l)">
              <div style="position:relative;flex-shrink:0;">
                <img *ngIf="l.photo" [src]="l.photo" style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #e8472a;" alt="avatar" />
                <div *ngIf="!l.photo" style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#e8472a,#ff7a5c);color:#fff;font-size:17px;font-weight:800;display:flex;align-items:center;justify-content:center;">
                  {{l.name?.charAt(0)?.toUpperCase()||'?'}}
                </div>
                <span style="position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;background:#22c55e;border:2px solid #fff;display:block;"></span>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:13px;color:#1a1a1a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{l.name}}</div>
                <div style="font-size:11px;color:#888;margin-top:1px;">📍 {{l.city || 'Unknown city'}}</div>
                <div *ngIf="l.languages?.length" style="font-size:10px;color:#aaa;margin-top:1px;">🗣 {{l.languages.slice(0,2).join(', ')}}</div>
              </div>
              <a [routerLink]="['/profile', l.userId]" (click)="$event.stopPropagation()"
                style="font-size:11px;font-weight:700;color:#e8472a;text-decoration:none;flex-shrink:0;padding:4px 8px;border-radius:6px;border:1px solid #ffd0c8;background:#fff0ee;white-space:nowrap;">
                View
              </a>
            </div>
          </div>

          <!-- Legend -->
          <div class="panel-legend">
            <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Map Legend</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <div style="width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #fff;box-shadow:0 1px 4px rgba(34,197,94,0.4);flex-shrink:0;"></div>
              <span style="font-size:12px;color:#555;">Local host available</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:12px;height:12px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 1px 4px rgba(59,130,246,0.4);flex-shrink:0;"></div>
              <span style="font-size:12px;color:#555;">Your location</span>
            </div>
          </div>
        </div>

        <!-- Floating local count badge -->
        <div *ngIf="localCount>0" class="count-badge">
          🟢 {{localCount}} local{{localCount===1?'':'s'}} on map
        </div>

        <!-- Loading overlay -->
        <div *ngIf="mapLoading" class="map-loading">
          <div style="text-align:center;">
            <div style="font-size:32px;margin-bottom:12px;">🌍</div>
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">Loading locals...</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6);">Geocoding {{geocodedCount}}/{{locals.length}}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .map-toolbar {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; padding: 10px 16px;
      background: #fff; border-bottom: 1px solid #eee;
      z-index: 10; flex-wrap: wrap;
    }
    :host-context(body.dark) .map-toolbar { background: #1a1a1a; border-color: #2a2a2a; }

    .map-search {
      width: 100%; margin: 0; padding: 9px 14px;
      border: 1.5px solid #eee; border-radius: 10px;
      font-size: 14px; outline: none; background: #fafafa; transition: all 0.2s;
    }
    .map-search:focus { border-color: #e8472a; background: #fff; box-shadow: 0 0 0 3px rgba(232,71,42,0.08); }
    :host-context(body.dark) .map-search { background: #111; border-color: #333; color: #f0f0f0; }

    .map-ctrl-btn {
      padding: 7px 13px; border-radius: 8px; border: 1.5px solid #eee;
      background: #fff; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.2s; color: #555; white-space: nowrap;
    }
    .map-ctrl-btn:hover { border-color: #e8472a; color: #e8472a; }
    .map-ctrl-btn.active { background: #e8472a; border-color: #e8472a; color: #fff; }
    :host-context(body.dark) .map-ctrl-btn { background: #1a1a1a; border-color: #2a2a2a; color: #aaa; }
    :host-context(body.dark) .map-ctrl-btn.active { background: #e8472a; color: #fff; }

    /* Side panel */
    .side-panel {
      width: 0; overflow: hidden;
      background: #fff; border-left: 1px solid #eee;
      display: flex; flex-direction: column;
      transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
      flex-shrink: 0;
    }
    .side-panel.open { width: 300px; }
    :host-context(body.dark) .side-panel { background: #1a1a1a; border-color: #2a2a2a; }

    .panel-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 14px 12px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0;
    }
    :host-context(body.dark) .panel-header { border-color: #2a2a2a; }
    :host-context(body.dark) .panel-header div[style*="color:#1a1a1a"] { color: #f0f0f0 !important; }

    .panel-stats {
      display: flex; gap: 0; padding: 12px 14px;
      border-bottom: 1px solid #f0f0f0; flex-shrink: 0;
    }
    :host-context(body.dark) .panel-stats { border-color: #2a2a2a; }
    .pstat { flex: 1; text-align: center; }
    .pstat-num { font-size: 20px; font-weight: 900; line-height: 1; }
    .pstat-label { font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; }

    .panel-list {
      flex: 1; overflow-y: auto; padding: 6px 0;
    }
    .panel-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; cursor: pointer; transition: background 0.15s;
    }
    .panel-item:hover { background: #f7f7f8; }
    :host-context(body.dark) .panel-item:hover { background: #222; }
    :host-context(body.dark) .panel-item div[style*="color:#1a1a1a"] { color: #f0f0f0 !important; }

    .panel-legend {
      padding: 14px; border-top: 1px solid #f0f0f0; flex-shrink: 0;
      background: #fafafa;
    }
    :host-context(body.dark) .panel-legend { background: #111; border-color: #2a2a2a; }

    /* Floating badge */
    .count-badge {
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,0.72); backdrop-filter: blur(8px);
      color: #fff; padding: 8px 18px; border-radius: 50px;
      font-size: 13px; font-weight: 700; z-index: 10; pointer-events: none;
      white-space: nowrap;
    }

    /* Loading overlay */
    .map-loading {
      position: absolute; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 20; backdrop-filter: blur(2px);
    }

    @media(max-width:768px) {
      .side-panel.open { width: 100%; position: absolute; top: 0; right: 0; bottom: 0; z-index: 50; }
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map!: maplibregl.Map;
  searchCity = '';
  searching = false;
  is3D = false;
  hasTerrain = false;
  localCount = 0;
  currentStyle = 'voyager';
  sidePanel = false;
  mapLoading = false;
  geocodedCount = 0;
  locals: any[] = [];
  filteredLocals: any[] = [];
  panelSearch = '';
  private markers: maplibregl.Marker[] = [];

  mapStyles = [
    { id: 'voyager',   label: '🗺 Map',       url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
    { id: 'dark',      label: '🌙 Dark',      url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
    { id: 'satellite', label: '🛰 Satellite', url: 'https://demotiles.maplibre.org/style.json' },
  ];

  get uniqueCities() { return new Set(this.locals.map(l => l.city?.toLowerCase()).filter(Boolean)).size; }
  get verifiedCount() { return this.locals.filter(l => l.isVerified).length; }

  constructor(private profileSvc: ProfileService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['city']) {
        this.searchCity = params['city'];
        if (this.map) this.flyToCity();
      }
    });
    // Load profiles immediately on init — before map is ready
    this.loadProfileList();
  }

  ngAfterViewInit() {
    this.map = new maplibregl.Map({
      container: 'maplibre',
      style: this.mapStyles[0].url,
      center: [0, 20],
      zoom: 2, pitch: 0, bearing: 0,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
    this.map.addControl(new maplibregl.ScaleControl(), 'bottom-right');
    this.map.addControl(new maplibregl.FullscreenControl(), 'top-right');

    // Load profile list immediately — don't wait for map idle
    // (already called in ngOnInit, just place markers here)
    this.map.once('idle', () => {
      this.forceEnglishLabels();
      if (this.locals.length > 0) {
        this.placeMarkers();
      } else {
        // profiles not loaded yet — wait for them
        const check = setInterval(() => {
          if (this.locals.length > 0) { clearInterval(check); this.placeMarkers(); }
        }, 200);
        setTimeout(() => clearInterval(check), 10000);
      }
      if (this.searchCity) this.flyToCity();
    });
  }

  setStyle(s: any) {
    this.currentStyle = s.id;
    this.map.setStyle(s.url);
    this.map.once('idle', () => {
      this.forceEnglishLabels();
      this.placeMarkers();
      if (this.is3D) this.add3DBuildings();
    });
  }

  private forceEnglishLabels() {
    const style = this.map.getStyle();
    if (!style?.layers) return;
    style.layers.forEach((layer: any) => {
      if (layer.type !== 'symbol') return;
      const textField = layer?.layout?.['text-field'];
      if (!textField) return;
      // Replace any name expression with name:en fallback to name
      this.map.setLayoutProperty(layer.id, 'text-field', [
        'coalesce', ['get', 'name:en'], ['get', 'name']
      ]);
    });
  }

  toggle3D() {
    this.is3D = !this.is3D;
    if (this.is3D) { this.map.easeTo({ pitch: 55, bearing: -20, duration: 800 }); this.add3DBuildings(); }
    else { this.map.easeTo({ pitch: 0, bearing: 0, duration: 800 }); this.remove3DBuildings(); }
  }

  add3DBuildings() {
    if (this.map.getLayer('3d-buildings')) return;
    const layers = this.map.getStyle().layers;
    let labelLayerId: string | undefined;
    for (const layer of layers) {
      if (layer.type === 'symbol' && (layer as any).layout?.['text-field']) { labelLayerId = layer.id; break; }
    }
    this.map.addLayer({
      id: '3d-buildings', source: 'composite' as any, 'source-layer': 'building',
      filter: ['==', 'extrude', 'true'], type: 'fill-extrusion', minzoom: 14,
      paint: {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'height']],
        'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'min_height']],
        'fill-extrusion-opacity': 0.7,
      } as any
    }, labelLayerId);
  }

  remove3DBuildings() { if (this.map.getLayer('3d-buildings')) this.map.removeLayer('3d-buildings'); }

  toggleTerrain() {
    this.hasTerrain = !this.hasTerrain;
    if (this.hasTerrain) {
      if (!this.map.getSource('terrain-source')) {
        this.map.addSource('terrain-source', { type: 'raster-dem', url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json', tileSize: 256 });
      }
      this.map.setTerrain({ source: 'terrain-source', exaggeration: 1.5 });
      this.map.easeTo({ pitch: 50, duration: 800 });
    } else {
      this.map.setTerrain(undefined as any);
      this.map.easeTo({ pitch: this.is3D ? 55 : 0, duration: 800 });
    }
  }

  locateMe() {
    navigator.geolocation.getCurrentPosition(pos => {
      // Add blue dot for user location
      const el = document.createElement('div');
      el.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,0.3);';
      new maplibregl.Marker({ element: el })
        .setLngLat([pos.coords.longitude, pos.coords.latitude])
        .setPopup(new maplibregl.Popup({ offset: 14 }).setHTML('<div style="font-family:system-ui;font-weight:700;font-size:13px;">📍 You are here</div>'))
        .addTo(this.map);
      this.map.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 12, pitch: 45, duration: 1500 });
    });
  }

  loadProfileList() {
    this.profileSvc.clearCache();
    this.profileSvc.listProfiles().subscribe({
      next: (profiles: any[]) => {
        this.locals = profiles.filter(p => p.role === 'local' && p.city?.trim());
        this.filteredLocals = [...this.locals];
        console.log(`Map: loaded ${this.locals.length} locals from ${profiles.length} profiles`);
        if (this.map?.isStyleLoaded() && this.locals.length > 0) {
          this.placeMarkers();
        }
      },
      error: (e) => console.error('Map: failed to load profiles', e)
    });
  }

  loadLocals() {
    this.loadProfileList();
  }

  placeMarkers() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
    this.localCount = 0;
    this.geocodedCount = 0;
    if (this.locals.length > 0) {
      this.mapLoading = true;
      this.locals.forEach((p, i) => setTimeout(() => this.geocodeAndMark(p), i * 1200));
      setTimeout(() => this.mapLoading = false, this.locals.length * 1200 + 1000);
    }
  }

  filterLocals() {
    const q = this.panelSearch.toLowerCase();
    this.filteredLocals = q
      ? this.locals.filter(l => l.name?.toLowerCase().includes(q) || l.city?.toLowerCase().includes(q))
      : [...this.locals];
  }

  flyToLocal(l: any) {
    if (!l.city) return;
    this.searchCity = l.city;
    this.flyToCity();
  }

  geocodeAndMark(profile: any) {
    const city = profile.city?.trim();
    if (!city) return;
    const uid = profile.userId || profile._id;

    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, {
      headers: { 'Accept-Language': 'en' }
    })
      .then(r => r.json())
      .then((data: any[]) => {
        this.geocodedCount++;
        if (!data[0]) return;
        const lat = parseFloat(data[0].lat), lng = parseFloat(data[0].lon);

        const el = document.createElement('div');
        el.style.cssText = 'width:16px;height:16px;border-radius:50%;background:#22c55e;border:2px solid #fff;box-shadow:0 2px 8px rgba(34,197,94,0.6);cursor:pointer;transition:transform 0.2s;';
        el.onmouseenter = () => el.style.transform = 'scale(1.6)';
        el.onmouseleave = () => el.style.transform = 'scale(1)';

        const popup = new maplibregl.Popup({ offset: 14, closeButton: false, maxWidth: '220px' })
          .setHTML(`
            <div style="font-family:system-ui;padding:4px 2px;">
              <div style="font-weight:800;font-size:14px;margin-bottom:2px;">${profile.name || 'Local'}</div>
              <div style="color:#888;font-size:12px;margin-bottom:6px;">📍 ${city}</div>
              ${profile.languages?.length ? `<div style="font-size:11px;color:#aaa;margin-bottom:8px;">🗣 ${profile.languages.slice(0,2).join(', ')}</div>` : ''}
              <a href="/profile/${uid}" style="display:inline-block;padding:6px 14px;background:#e8472a;color:#fff;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">View Profile →</a>
            </div>
          `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(this.map);
        this.markers.push(marker);
        this.localCount++;
      })
      .catch(() => { this.geocodedCount++; });
  }

  flyToCity() {
    if (!this.searchCity.trim()) return;
    this.searching = true;
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.searchCity)}&format=json&limit=1`)
      .then(r => r.json())
      .then((data: any[]) => {
        this.searching = false;
        if (!data[0]) return;
        const d = data[0];
        const bb = d.boundingbox; // [minLat, maxLat, minLon, maxLon]
        if (bb) {
          // Fit to the bounding box so countries zoom out, cities zoom in naturally
          this.map.fitBounds(
            [[parseFloat(bb[2]), parseFloat(bb[0])], [parseFloat(bb[3]), parseFloat(bb[1])]],
            { padding: 60, duration: 2000, pitch: this.is3D ? 55 : 0, bearing: this.is3D ? -20 : 0, maxZoom: 12 }
          );
        } else {
          this.map.flyTo({
            center: [parseFloat(d.lon), parseFloat(d.lat)],
            zoom: 10, pitch: this.is3D ? 55 : 0,
            bearing: this.is3D ? -20 : 0, duration: 2000, essential: true,
          });
        }
      })
      .catch(() => { this.searching = false; });
  }

  ngOnDestroy() { if (this.map) this.map.remove(); }
}
