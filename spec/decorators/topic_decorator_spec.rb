# coding: utf-8
require 'rails_helper'
require 'webmock/rspec'

describe TopicDecorator do
  describe 'process_body' do
    let(:topic) { build(:topic) }
    before do
      decorate(topic)
      stub_request(:get, 'www.example.com/sample.jpg').
        with(headers: { Accept: ['image/jpeg', 'image/png']})
    end

    context 'image' do
      it 'image_tagに変換される' do
        url = 'http://www.example.com/sample.jpg'
        body = "画像テスト\r\n#{url}"
        topic.body = body
        expect(!!(topic.send(:image, [url]).match(/<img src.*>/))).to be_truthy
      end
    end

    context 'link_thumbnail_description' do
      it 'サムネイルが生成される' do
        url = 'http://www.yahoo.co.jp/'
        image_url = 'http://www.example.com/sample.jpg'
        body = "画像テスト\r\n#{url}\r\n#{image_url}"
        topic.body = body
        expect(!!(topic.process_body).match(/<img src.*>/)).to be_truthy
      end
    end
  end
end