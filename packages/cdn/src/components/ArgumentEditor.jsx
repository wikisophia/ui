
let premiseCounter = 0;
function newPremise(premiseText) {
  return {
    text: premiseText,
    id: premiseCounter++
  };
}

function premisesToState(premisesProps) {
  const state = premisesProps.map(newPremise);
  while (state.length < 2) {
    state.push(newPremise(""));
  }
  return state;
}

export function ManageArgumentState(Wrapped) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        conclusion: props.conclusion,
        premises: premisesToState(props.premises),
      };

      this.deletePremise = this.deletePremise.bind(this);
      this.addPremise = this.addPremise.bind(this);
      this.handlePremiseChange = this.handlePremiseChange.bind(this);
      this.handleConclusionChange = this.handleConclusionChange.bind(this);
    }

    deletePremise(index) {
      this.setState((prevState) => {
        const newPremises = prevState.premises.slice(0, index).concat(prevState.premises.slice(index+1));
        while (newPremises.length < 2) {
          newPremises.push(newPremise(""));
        }
        return {
          premises: newPremises
        };
      });
    }

    addPremise() {
      this.setState((prevState) => {
        return {
          premises: prevState.premises.concat([newPremise("")])
        };
      })
    }

    handlePremiseChange(index, newText) {
      this.setState((prevState) => {
        const copy = prevState.premises.slice()
        copy[index].text = newText
        return {
          premises: copy
        };
      })
    }

    handleConclusionChange(newText) {
      this.setState({
        conclusion: newText
      });
    }

    render() {
      const {
        onPremiseChange,
        onPremiseDelete,
        onPremiseAdd,
        onConclusionChange,
        onSave,
        premises,
        conclusion,
        ...otherProps
      } = this.props;

      const state = this.state
      function saveHandler() {
        onSave({
          conclusion: state.conclusion,
          premises: state.premises.map((premise) => premise.text)
        })
      }
      return (
        <Wrapped onPremiseChange={this.handlePremiseChange}
                 onPremiseDelete={this.deletePremise}
                 onPremiseAdd={this.addPremise}
                 onConclusionChange={this.handleConclusionChange}
                 onSave={saveHandler}
                 premises={this.state.premises}
                 conclusion={this.state.conclusion}
                 {...otherProps}
         />
      );
    }
  }
}

export default class ArgumentEditor extends React.Component {
  render() {
    return (
      <div>
        <Conclusion conclusion={this.props.conclusion} onChange={this.props.onConclusionChange} />
        <p>because...</p>
        <PremiseList premises={this.props.premises} onAdd={this.props.onPremiseAdd} onDelete={this.props.onPremiseDelete} onChange={this.props.onPremiseChange}/>
        <button type="button" className="save-argument" onClick={this.props.onSave}>Save</button>
        <p id="save-error" className="save-error">{this.props.error}</p>
      </div>
    );
  }
}

class Conclusion extends React.Component {
  render() {
    return <section className="conclusion">
      <input className="conclusion-entry"
             type="text"
             placeholder="Set conclusion here"
             onChange={(ev) => this.props.onChange(ev.target.value)}
             value={this.props.conclusion} />
    </section>;
  }
}

class Premise extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ev) {
    this.props.onChange(ev.target.value)
  }

  render() {
    return <li className="premise-element">
      <input className="premise-entry"
             type="text"
             placeholder="Add premise here"
             onChange={this.handleChange}
             value={this.props.premise} />
      <button type="button" className="delete-premise" onClick={this.props.onDelete}>Delete</button>
    </li>;
  }
}

class PremiseList extends React.Component {
  render() {
    const self = this;
    let premiseElements = this.props.premises.map((premise, i) =>
      <Premise key={premise.id}
               premise={premise.text}
               onChange={self.props.onChange.bind(null, i)}
               onDelete={self.props.onDelete.bind(null, i)}
      />);
    return <section className="premises">
      <ul className="premise-list">
        {premiseElements}
      </ul>
      <button type="button" className="add-premise" onClick={this.props.onAdd.bind(null, "")}>New premise</button>
    </section>;
  }
}
