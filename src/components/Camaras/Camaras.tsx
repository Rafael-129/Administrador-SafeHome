import { useState } from 'react'
import './Camaras.css'
import type { Camara, ComponentProps } from '../../types'

export default function Camaras({}: ComponentProps) {
  const [selectedCamera, setSelectedCamera] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [zoom] = useState(1)
  const [feedback, setFeedback] = useState<string | null>(null)

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
    if (selectedCameraData.estado !== 'Online') {
      setFeedback('No se puede grabar una cámara offline.')
      return
    }
    setIsRecording(!isRecording)
    setFeedback(isRecording ? 'Grabación detenida.' : 'Grabación iniciada.')
  }

  const handleTomarCaptura = () => {
    if (selectedCameraData.estado !== 'Online') {
      setFeedback('No se puede tomar captura de una cámara offline.')
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 360
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setFeedback('No se pudo crear la captura.')
      return
    }

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText(selectedCameraData.nombre, 30, 80)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '20px sans-serif'
    ctx.fillText(selectedCameraData.ubicacion, 30, 120)
    ctx.fillText(new Date().toLocaleString('es-PE'), 30, 160)

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `captura_camara_${selectedCameraData.id}.png`
    link.click()
    setFeedback('Captura generada y descargada.')
  }

  const handleVerGrabaciones = () => {
    setFeedback('Grabaciones no conectadas a backend. Esta acción requiere almacenamiento real.')
  }

  const handleConfigurarAlertas = () => {
    setFeedback('Configuración de alertas pendiente de integración con notificaciones del servidor.')
  }

  const handleFullscreen = () => {
    setFeedback('Modo pantalla completa depende del stream de video real.')
  }

  const handleSettings = () => {
    setFeedback(`Configuración local abierta para ${selectedCameraData.nombre}.`)
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

      {feedback && (
        <div className="camera-stats" style={{ marginTop: '1rem' }}>
          <div className="stat-item online" style={{ width: '100%' }}>
            <div className="stat-label" style={{ color: '#e2e8f0' }}>{feedback}</div>
          </div>
        </div>
      )}
    </div>
  )
}