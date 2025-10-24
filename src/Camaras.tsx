import { useState } from 'react'
import './Camaras.css'

interface Camara {
  id: number
  nombre: string
  ubicacion: string
  resolucion: string
  fps: string
  estado: 'Online' | 'Offline'
}

interface CamarasProps {
  onBack: () => void
}

export default function Camaras({ }: CamarasProps) {
  const [selectedCamera, setSelectedCamera] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [volume, setVolume] = useState(50)
  const [zoom, setZoom] = useState(1)

  const camaras: Camara[] = [
    {
      id: 1,
      nombre: 'Cámara Principal',
      ubicacion: 'Entrada Principal',
      resolucion: '1920x1080',
      fps: '60fps',
      estado: 'Online'
    },
    {
      id: 2,
      nombre: 'Cámara Estacionamiento',
      ubicacion: 'Área de Estacionamiento',
      resolucion: '1280x720',
      fps: '30fps',
      estado: 'Online'
    },
    {
      id: 3,
      nombre: 'Cámara Ascensor',
      ubicacion: 'Hall de Ascensores',
      resolucion: '1920x1080',
      fps: '30fps',
      estado: 'Offline'
    },
    {
      id: 4,
      nombre: 'Cámara Jardín',
      ubicacion: 'Área Común',
      resolucion: '1280x720',
      fps: '25fps',
      estado: 'Online'
    }
  ]

  const selectedCameraData = camaras.find(cam => cam.id === selectedCamera) || camaras[0]
  const onlineCameras = camaras.filter(cam => cam.estado === 'Online').length
  const offlineCameras = camaras.filter(cam => cam.estado === 'Offline').length

  const handleGrabarVideo = () => {
    setIsRecording(!isRecording)
    console.log(isRecording ? 'Deteniendo grabación' : 'Iniciando grabación')
  }

  const handleTomarCaptura = () => {
    console.log('Tomando captura de', selectedCameraData.nombre)
    alert('Captura tomada exitosamente')
  }

  const handleVerGrabaciones = () => {
    console.log('Ver grabaciones')
    alert('Abriendo archivo de grabaciones...')
  }

  const handleConfigurarAlertas = () => {
    console.log('Configurar alertas')
    alert('Abriendo configuración de alertas...')
  }

  const handleFullscreen = () => {
    console.log('Modo pantalla completa')
  }

  const handleSettings = () => {
    console.log('Configuraciones de cámara')
  }

  return (
    <div className="camaras-container">
      {/* Header */}
      <div className="camaras-header">
        <div className="header-content">
          <h1>Gestión de Cámaras</h1>
          <p>Monitor en tiempo real y gestiona todas las cámaras del sistema de seguridad</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="camaras-main">
        {/* Video Section */}
        <div className="video-section">
          <div className="video-header">
            <h3>Transmisión en Vivo</h3>
            <div className="live-indicator">
              <span className="live-dot"></span>
              EN VIVO
            </div>
          </div>

          <div className="video-container">
            <div className="video-player">
              <div className="video-placeholder">
                <div className="camera-icon">📹</div>
                <div className="camera-info">
                  <h4>{selectedCameraData.nombre}</h4>
                  <p>{selectedCameraData.resolucion} • {selectedCameraData.fps}</p>
                </div>
              </div>

              {/* Video Controls */}
              <div className="video-controls">
                <div className="controls-left">
                  <button className="control-btn" title="Pausar">
                    ⏸️
                  </button>
                  <button className="control-btn" title="Volumen">
                    🔊
                  </button>
                  <span className="camera-name">{selectedCameraData.nombre}</span>
                </div>

                <div className="controls-right">
                  <button onClick={handleSettings} className="control-btn" title="Configuraciones">
                    ⚙️
                  </button>
                  <button onClick={handleFullscreen} className="control-btn" title="Pantalla completa">
                    🔳
                  </button>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="video-info">
              <div className="info-item">
                <span className="info-label">Estado</span>
                <span className={`info-value status ${selectedCameraData.estado.toLowerCase()}`}>
                  {selectedCameraData.estado}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Resolución</span>
                <span className="info-value">{selectedCameraData.resolucion}</span>
              </div>
              <div className="info-item">
                <span className="info-label">FPS</span>
                <span className="info-value">{selectedCameraData.fps}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Zoom</span>
                <span className="info-value">{zoom}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Camera List */}
        <div className="camera-list-section">
          <div className="list-header">
            <h3>Lista de Cámaras</h3>
          </div>

          <div className="camera-list">
            {camaras.map((camara) => (
              <div 
                key={camara.id}
                className={`camera-item ${selectedCamera === camara.id ? 'selected' : ''}`}
                onClick={() => setSelectedCamera(camara.id)}
              >
                <div className="camera-item-header">
                  <h4>{camara.nombre}</h4>
                  <span className={`status-badge ${camara.estado.toLowerCase()}`}>
                    {camara.estado}
                  </span>
                </div>
                <p className="camera-location">{camara.ubicacion}</p>
                <p className="camera-specs">{camara.resolucion} • {camara.fps}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="camera-stats">
            <div className="stat-item online">
              <div className="stat-number">{onlineCameras}</div>
              <div className="stat-label">Online</div>
            </div>
            <div className="stat-item offline">
              <div className="stat-number">{offlineCameras}</div>
              <div className="stat-label">Offline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          onClick={handleGrabarVideo} 
          className={`action-btn record ${isRecording ? 'recording' : ''}`}
        >
          {isRecording ? '⏹️ Detener Grabación' : '🎥 Grabar Video'}
        </button>
        
        <button onClick={handleTomarCaptura} className="action-btn capture">
          📸 Tomar Captura
        </button>
        
        <button onClick={handleVerGrabaciones} className="action-btn recordings">
          📁 Ver Grabaciones
        </button>
        
        <button onClick={handleConfigurarAlertas} className="action-btn alerts">
          🔔 Configurar Alertas
        </button>
      </div>
    </div>
  )
}