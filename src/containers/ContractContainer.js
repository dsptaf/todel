import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {fethLanguage, FetchContractData, ProfileFetchData, fetchRegistrLabel, ROOT_URL, EmailContractDouble, fetchContractToPay} from '../actions/index';
import { connect } from 'react-redux';
import Conclusion from './ConclusionContainer';
import _ from 'lodash';

class Agreement extends Component{
    static contextTypes = {
        router: PropTypes.object
    };
    constructor(props){
        super(props);
        this.state = {
            form: false
        };
        this.openForm = this.openForm.bind(this);
        this.openCard = this.openCard.bind(this);
        this.downloadContract = this.downloadContract.bind(this);
        this.renderTablePay = this.renderTablePay.bind(this);
    }
    componentWillMount(){
        let token = localStorage.getItem('id_token');
        let lang = localStorage.getItem('languages');
        if(lang!=null){
            this.props.fethLanguage(lang);
            this.props.fetchRegistrLabel(lang, 'PU');
        }else{
            this.props.fethLanguage('ru');
            this.props.fetchRegistrLabel('ru', 'PU');
        }
        this.props.FetchContractData(token);
        this.props.ProfileFetchData(token);
        this.props.fetchContractToPay(token);
    }
    componentDidMount(){
        $('.loader-inner').loaders();
    }
    openForm(){
        this.setState({
            form: !this.state.form
        })
    }
    openCard(){
        this.setState({
            form: false
        })
    }
    downloadContract(e, elem){
        $('.loader-inner').loaders();
        let token = localStorage.getItem('id_token');
        let btn = elem.target;
        $(btn).closest('.loader-wrapper').addClass('active');
        window.location = e;
        setTimeout(()=>{
            $(btn).closest('.loader-wrapper').removeClass('active');
        },1500)

    }
    DownloadEmailContract(e, elem){
        $('.loader-inner').loaders();
        let token = localStorage.getItem('id_token');
        let btn = elem.target;
        $(btn).closest('.loader-wrapper').addClass('active');
        this.props.EmailContractDouble(token, e).then((response) =>{
            if(response.payload.status == 200) {
                $(btn).closest('.loader-wrapper').removeClass('active');
            }else{
                $(btn).closest('.loader-wrapper').removeClass('active');
            }
        })
    }
    renderTablePay(){
        const language = this.props.language.page;
        let signed = _.findWhere(this.props.contract.contractPay, {invoice_is_signed: true});
        let newArr = this.props.contract.contractPay.sort(function (a, b) {
            return parseInt(a.id) > parseInt(b.id);
        });
        return newArr.map((item)=>{
            return (
                <div className={signed ? "rowTable body widthAuto" : "rowTable body"} key={item.id}>
                    <div>{item.createdon}</div>
                    <div>
                        <div className="relative downloadWrapper loader-wrapper">
                            <button type="button" className="btn btn-default" onClick={this.downloadContract.bind(this, (this.props.language.lang == "ru" ? item.download_ru : item.download_en))}>{language.contract.dowContr}</button>
                            <div className="loader-inner ball-scale-multiple"></div>
                        </div>
                    </div>
                    <div>
                        <div className="relative downloadWrapper big loader-wrapper">
                            
                            <button type="button" className="btn btn-default" onClick={this.downloadContract.bind(this, (this.props.language.lang == "ru" ? item.download_contract_bill_ru : item.download_contract_bill_en ))}>{language.contract.getBill}</button>
                            <div className="loader-inner ball-scale-multiple"></div>
                        </div>
                    </div>
                    {item.invoice_is_signed ?
                        <div>
                            <div className="relative downloadWrapper big loader-wrapper">
                                <button type="button" className="btn btn-default" onClick={this.downloadContract.bind(this, item.invoice )}>{language.contract.getBillFac}</button>
                                <div className="loader-inner ball-scale-multiple"></div>
                            </div>
                        </div>
                        :""}
                </div>
            )
        })
    }
    render(){
        const language = this.props.language.page;
        return(
            <div>
                {this.props.contract.contractPay.length > 0 ?
                    <div className="contractToPay">
                        <h2>{language.contract.contractToPay}</h2>
                        <div className='block text block-content'>
                            <div className='table tableDiv'>
                                <div className="rowTable header">
                                    <div>{language.contract.numberContract}</div>
                                    <div></div>
                                    <div></div>
                                    {$('.contractToPay').find('.widthAuto').length > 0 ?
                                        <div></div>
                                        :
                                        ""
                                    }
                                </div>
                                {this.renderTablePay()}
                            </div>
                        </div>
                    </div>
                    :
                    ""
                }
                <h2>{language.contract.conclusionContract}</h2>
                {!$.isEmptyObject( this.props.translit ) ?
                    <div className='block text block-content'>
                        <div dangerouslySetInnerHTML={this.props.language.lang == 'ru' ? {__html: this.props.translit.contract_text_ru.text} : {__html: this.props.translit.contract_text_en.text}}></div>
                        <h4>{language.contract.payment}</h4>
                        <div className='button-group clearfix'>
                            <button type="button" className={ this.state.form ? 'btn btn-default active' : 'btn btn-default'} onClick={this.openForm}>{language.contract.conclusionContract}</button>
                        </div>
                    </div>
                    :
                    ""
                }
                {this.state.form ?
                    <Conclusion />
                    :""
                }
            </div>
        )
    }
}

function  mapStateToProps(state) {
    return{
        language: state.language,
        contract: state.contract,
        user: state.user,
        translit: state.translit
    }
}
export default connect(mapStateToProps, {fethLanguage, FetchContractData, fetchRegistrLabel, ProfileFetchData, EmailContractDouble, fetchContractToPay})(Agreement);
//<button type="button" className="btn btn-default" onClick={this.openCard}>{language.contract.card}</button>