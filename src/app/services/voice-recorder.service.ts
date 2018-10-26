import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceRecorderService {

  constructor() { }


  recordedAudio:any;
  recordedAudioUrl:any;

  grabarAudio(stopButton){

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
     
      const mediaRecorder=new MediaRecorder(stream);
      
      mediaRecorder.start();

      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        this.recordedAudio=audio;
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
