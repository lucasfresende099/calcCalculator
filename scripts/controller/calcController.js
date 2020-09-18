class CalcController{
 
    constructor(){

        this._audio = new Audio('click.mp3')
        this._audioOnOff = false
        this._lastOperator = ''
        this._lastNumber = ''
 
        this._operation = [] //Array para guardar as operações
        this._locale = 'pt-BR' // variavel para local
        this._displayCalcEl = document.querySelector("#display") //Display da calculadora
        this._dateEl = document.querySelector("#data") //Data da calculadora
        this._timeEl = document.querySelector("#hora") // Hora da caalculadora
        this._currentDate 
        this.initialize() // Funçao de inicialização
        this.initButtonsEvents()// Função de eventos dos botões
        this.initKeyboard()
        
    }
    //metodo de ctrlv
    pasteFromClipboard(){

        document.addEventListener('paste', e=>{
            
            let text = e.clipboardData.getData('Text')
            this.displayCalc = parseFloat(text)
            
        })
    }
    // metodo de ctrlc
    copyToClipboard(){
        
        let input = document.createElement('input')
        input.value = this.displayCalc

        document.body.appendChild(input)

        input.select()

        document.execCommand('Copy')

        input.remove()
    }
 
    //Função de inicialização - Principal
    initialize(){
        
        this.setdisplayDateTime()
        setInterval(()=>{ //Seta o intevalo de tempo que a hora deve atualizar. O this.currentDate retorna a instancia de um novo Date
           this.setdisplayDateTime()
        }, 1000)

        this.setLastNumberToDisplay()
        this.pasteFromClipboard()

        //apertar o botao para soltar o audio
        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e =>{

                this.toggleAudio()
            })
        })
    }

    //metodo de acionar o audio 
    toggleAudio(){
        
        this._audioOnOff = !this._audioOnOff
       // formas alternativas de fazer o if
       // this._audioOnOff = (this._audioOnOff) ? false : true
        /*if(this.audioOnOff){
            this._audioOnOff = false
        } else{
            this._audioOnOff = true
        }
        */
    }
  
    //metodo de sair o audio
    playAudio(){
        if (this._audioOnOff){
            
            this._audio.currentTime = 0
            this._audio.play()
        }

    }
   // metodo para usar o teclado
    initKeyboard(){
 
        document.addEventListener('keyup', e=>{
            this.playAudio()

            switch(e.key){
                case'Escape':
                    this.clearAll()
                    break
                case 'Backspace':
                    this.clearEntry()
                    break
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key)
                    break
                case 'Enter':
                case '=':
                    this.calc()
                    break
                case '.':
                case ',':
                    this.addDot('.')
                    break
                case '0': 
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))    
                    break
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard()
                    break
            }
        })
 
    }
 
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event=>{
           element.addEventListener(event,fn,false)
        })
    }
 
    //Limpa o display da calculadora
    clearAll(){
        
        this._operation = []
        this._lastNumber =''
        this._lastOperator =''
        this.setLastNumberToDisplay()
    }
    //Retira o ultmo valor adicionado ao array
    clearEntry(){
        
        this._operation.pop()
        this.setLastNumberToDisplay()
    }
    
    getLastOperation(){
     
        return  this._operation[this._operation.length-1]
    }

    setLastOperation(value){
       
        this._operation[this._operation.length-1] = value
    }
    isOperator(value){
        
        return (['+', '-','*','%','/'].indexOf(value) > -1)
    }

    pushOperation(value){
        
        this._operation.push(value)

        if(this._operation.length >3){
            this.calc()
        }
    }

    getResult(){
        try{
            return eval(this._operation.join(''))
        } catch(e){
            //tempo de resposta antes me mostrar o resultado final para mostrar o erro.
            setTimeout(() =>{
                this.setError() 
            },1)
        }
        
    }
    calc(){

        let last =''
        this._lastOperator = this.getLastItem(true)

        if(this._operation.length < 3){

            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber]
        }

        if(this._operation.length > 3){

            last = this._operation.pop()

            this._lastNumber = this.getResult()

        } else if(this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false)
        }

        let result = this.getResult()
       
        if(last == '%'){

            result /= 100
            this._operation = [result]

        } else{

            this._operation = [result]

            if (last) this._operation.push(last)

        }

        this.setLastNumberToDisplay()
    }

        getLastItem(isOperator = true){
            
            let lastItem 

            for (let i = this._operation.length-1; i >= 0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
            lastItem = this._operation[i]
            break
                }
            } 

            if (!lastItem){
                lastItem = (isOperator) ? this._lastOperator : this._lastNumber
            }
            
            return lastItem

        }
    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false)
       
        if(!lastNumber) lastNumber = 0
        this.displayCalc = lastNumber

    }
    //Adiciona um valor na ultima posicao do array
    addOperation(value){

        if (isNaN(this.getLastOperation())){
        //String
            if(this.isOperator(value)){
            //trocar o operador
                 this.setLastOperation(value)

            }else{
                
                this.pushOperation(value)

                this.setLastNumberToDisplay()
            }

        }else {
            if (this.isOperator(value)){
                this.pushOperation(value)
            }else{

                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue)

                //atualizar display
                this.setLastNumberToDisplay()
            }
        }

    }
    //Aparece a mensagem de erro no console da calculadora
    setError(){
        this.displayCalc = 'ERROR'
    }
    addDot(){
         let lastOperation = this.getLastOperation()

         if(typeof lastOperation === 'string' && lastOperation.split('').indexof('.') > - 1) return;

         if(this.isOperator(lastOperation) || !lastOperation){
             this.pushOperation('0.')
         }else{
             this.setLastOperation(lastOperation.toString() + '.')
         }

         this.setLastNumberToDisplay()
    }
    //Método de executar um botão
    execBtn(value){
        this.playAudio()

        switch(value){
            case'ac':
                this.clearAll()
                break
            case 'ce':
                this.clearEntry()
                break
            case 'soma':
                 this.addOperation('+')
                break
            case 'subtracao':
                this.addOperation('-')
                break
            case 'divisao':
                this.addOperation('/')
                break
            case 'multiplicacao':
                this.addOperation('*')
                break
            case 'porcento':
                this.addOperation('%')
                break
            case 'igual':
                this.calc()
                break
            case 'ponto':
                this.addDot('.')
                break
            case '0': 
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))    
                break
 
 
            default:
                this.setError()
            break   
            
        }
    }
 
    // Função de Inicialização dos Botões - lê do HTML os dados da calculadora 
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")
 
        buttons.forEach((btn,index)=>{
            this.addEventListenerAll(btn,"click drag ", e=>{
                let textBtn = btn.className.baseVal.replace("btn-","")
                this.execBtn(textBtn)
            })
            //Configura a seta do mouse 
            this.addEventListenerAll(btn,"mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer"
            })
        })
        
 
    }
    
    // Métodos Sets e Gets
 
    setdisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "short",
            year: "numeric"
 
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }
 
 
    get displayTime(){
        return this._timeEl.innerHTML
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value
    }
 
    get displayDate(){
        return this._dateEl.innerHTML
    }
 
    set displayDate(value){
        return this._dateEl.innerHTML = value
    }
 
 
    get displayCalc(){
        return this._displayCalcEl.innerHTML
    }
    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError()
            return false
        }
        this._displayCalcEl.innerHTML = value
    }
 
    get currentDate(){
        return new Date()
    }
    set currentDate(data){
        this._currentDate = data
    }
 
}