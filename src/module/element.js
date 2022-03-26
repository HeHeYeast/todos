import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';
import React from 'react';
import ReactDOM from 'react-dom';
import '../css/mycss.css';

function Title(props) {
  return <h1 className="myTitle">Todos</h1>;
}

function myFind(currentlist,obj) {
  for(let i=0;i<currentlist.length;i++) {
    if(currentlist[i].name===obj.name&&currentlist[i].finish===obj.finish) {
      return i;
    }
  }
  return -1;
}
  
class MainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      events:[],
      editevent:-1
    };
    this.haveToClear=this.haveToClear.bind(this);
    this.handleClick=this.handleClick.bind(this);
    this.delEvent=this.delEvent.bind(this);
    this.finishEvent=this.finishEvent.bind(this);
    this.dbClick=this.dbClick.bind(this);
    this.textInput=React.createRef();
  }
  /*
  haveToClear用于清除完成的事件
  handleClick用于读入input框并加入事件
  delEvent用于删除事件
  finishEvent用于改变事件对应的完成状态
  所有事件的名称以及完成状态都汇总在MainContent中，方便进行管理
  */

  dbClick(obj) {
    this.state.editevent=myFind(this.state.events,obj);
    if(this.state.editevent===-1) return;
    this.textInput.current.focusOnInputBar();
  }

  haveToClear() {
    console.log('clearbutton clicked!');
    let currentevents=this.state.events;
    currentevents=currentevents.filter(function(obj){
      console.log(obj);
      return !obj.finish;
    })
    console.log(currentevents);
    this.setState({
      events:currentevents,
      editevent:this.state.editevent
    })
  }

  handleClick(eventname) {
    //console.log('submit');
    let currentevents=this.state.events;
    if(this.state.editevent!=-1) {
      currentevents[this.state.editevent].name=eventname.name;
      this.state.editevent=-1;
      this.setState({
        events:currentevents,
        editevent:this.state.editevent
      })
      return;
    }
    currentevents.push({
      name:eventname.name,
      finish:false
    });
    this.setState({
      events:currentevents,
      editevent:this.state.editevent
    })
  }

  delEvent(obj) {
    // console.log('delete');
    // console.log(obj);
    let index=myFind(this.state.events,obj);
    // console.log(this.state.events);
    // console.log(index);
    if(index<0) return;
    let currentlist=this.state.events;
    currentlist.splice(index,1);
    this.setState({
      events:currentlist,
      editevent:this.state.editevent
    })
  }
  
  finishEvent(obj) {
    let index=myFind(this.state.events,obj);
    if(index<0) return;
    let currentlist=this.state.events;
    currentlist[index].finish=!currentlist[index].finish;
    this.setState({
      events:currentlist,
      editevent:this.state.editevent
    })
  }

  render() {
    console.log('Main render');
    console.log(this.state.events);
    let length=this.state.events.length,counter,clearbutton;
    if(length===0) counter='';
    else if(length===1) counter=length.toString()+' item left';
    else counter=length.toString()+'items left';
    return (
      <div className='Main'>
        <InputBar val={this.state.val} onClick={this.handleClick} ref={this.textInput}/>
        <div className='Content'>
          <EventGroup nameList={this.state.events} delete={this.delEvent} finishClick={this.finishEvent} dbClick={this.dbClick}/>
          {length>0?
            <span className='counter'>{counter}</span>:
            <span></span>
          }
          {length>0?
            <button className='clearbutton' type='button' onClick={this.haveToClear}>clear</button>:
            <span></span>
          }
        </div>
      </div>
    );
  }
}

class InputBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      val:'',
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleClick=this.handleClick.bind(this);
    this.inputref=React.createRef();
  }

  focusOnInputBar() {
    this.inputref.current.focus();
  }

  handleChange(event) {
    let name=event.target.value;
    this.setState({val:name});
  }

  handleClick() {
    if(this.state.val==='')
      return;
    let currentname=this.state.val;
    this.setState({
      val:''
    })
    this.props.onClick({
      name:currentname,
      finish:false
    });
  }

  render() {
    let currentdisplay=this.state.val;
    return (<div className='InputBar'>
      <input className='inputbar' type='text' value={currentdisplay} onChange={this.handleChange} ref={this.inputref}/>
      <button className='button' type='button' onClick={this.handleClick} ref='myInput'>submit</button>
    </div>);
  }
}

class EventGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      eventName:props.nameList
    };
  }

  render() {
    //console.log(this.props.nameList);
    let eventlist=this.props.nameList.map((obj)=>{
      //console.log(obj);
      return (<MyEvent title={obj.name} finish={obj.finish} delete={this.props.delete} finishClick={this.props.finishClick} dbClick={this.props.dbClick}/>);
    });
    return (
      <div className='EventGroup'>
        {eventlist}
      </div>
    );
  }
}
  
class MyEvent extends React.Component {
  constructor(props) {
    super(props);
    this.delClick=this.delClick.bind(this);
    this.finishClick=this.finishClick.bind(this);
    this.dbClick=this.dbClick.bind(this);
  }

  dbClick() {
    this.props.dbClick({
      name:this.props.title,
      finish:this.props.finish
    })
  }

  delClick() {
    this.props.delete({
      name:this.props.title,
      finish:this.props.finish  
    });
  }

  finishClick() {
    this.props.finishClick({
      name:this.props.title,
      finish:this.props.finish
    })
  }

  render() {
    //console.log('ha');
    let currentclass=this.props.finish?'finishEvent':'event';
    //console.log(this.props.title+' finish: '+this.props.finish);
    return (
      <div className='myevent' onClick={this.finishClick} onDoubleClick={this.dbClick}>
        <h4 className={currentclass}>{this.props.title}</h4>
        <button className='delbutton' type='button' onClick={this.delClick}>delete</button>
      </div>
    );
  }

}
  
export default Title;
export {MainContent,EventGroup,MyEvent};