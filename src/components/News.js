import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'


export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  } 

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }
  capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
    document.title = `${this.capitalizeFirstLetter(props.category)} - News`
  }

  async updateNews()
  {
    const url =
      `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d5c3ad2ed4e849c8b4ac3ee935a3d901&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
      let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading:false
    });
  }

  async componentDidMount() {
    this.updateNews();
  }

  handlePreviousClick = async () => {
    this.setState({
      page: this.state.page - 1
    });
    this.updateNews();
  }

  handleNextClick = async () => {
      this.setState({
        page: this.state.page + 1
      });
      this.updateNews();
    }

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{margin:'35px 0px'}}>News - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  imgUrl={
                    element.urlToImage
                      ? element.urlToImage
                      : "https://c.ndtvimg.com/2023-03/m4r6rqsg_sasha-cheetah_625x300_27_March_23.jpg"
                  }
                  publishedAt = {element.publishedAt ? element.publishedAt : ""}
                  author = {element.author ? element.author : "Unknown"}
                  source = {element.source.name? element.source.name : ""}
                  newsUrl={element.url}
                />
              </div>
            );
          })}

          <div className="containor d-flex justify-content-between">
            <button
              disabled={this.state.page <= 1}
              type="button"
              className="btn btn-dark"
              onClick={this.handlePreviousClick}
            >
              &larr; Previous
            </button>
            <button
              disabled={
                this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)
              }
              type="button"
              className="btn btn-dark"
              onClick={this.handleNextClick}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default News;
