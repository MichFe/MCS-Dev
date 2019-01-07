import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceRecorderService {

  constructor() { }


  recordedAudio:any;
  recordedAudioUrl:any;
  audioPlay:any;

  grabarAudio(stopButton){

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
     
      const mediaRecorder=new MediaRecorder(stream);
      
      mediaRecorder.start();

      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3; codecs=opus'  });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        this.recordedAudio=audioBlob;
        this.audioPlay=audio;
        this.recordedAudioUrl=audioUrl;
        
      });

      stopButton.onclick= function(){
        if(mediaRecorder.state!='inactive'){
          mediaRecorder.stop();
        }
      }

      
    });
  }
}
