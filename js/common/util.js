/**
 * 音频模块工具类
 */
define(function(require, exports, module) {
    'use strict';

    //ArrayBuffer转16进制字符串
    exports.arrayBufferToHexChar = function(arrayBuffer){
    	var bufferStr = '';
    	var uint8Array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < uint8Array.length; i++) {
            if (uint8Array[i] <= 15) {
                bufferStr += '0' + uint8Array[i].toString(16);
            } else {
                bufferStr += uint8Array[i].toString(16);
            }
            bufferStr += ',';
        }
        return bufferStr.slice(0,bufferStr.length-1);
    }

    //根据同步标识返回数据长度
    exports.getLengthByFrameSync = function(arrayBuffer, frameSync, offset, reverse, frameSize) {
        var i = 0;
        var count = 200;
        var bufferStr = '';
        var uint8Array = new Uint8Array(arrayBuffer);
        offset = offset || 0;
        frameSize = frameSize || 0;
        if (!reverse) {
            while (true) {
                for (; i < count && i < uint8Array.length; i++) {
                    if (uint8Array[i] <= 15) {
                        bufferStr += '0' + uint8Array[i].toString(16);
                    } else {
                        bufferStr += uint8Array[i].toString(16);
                    }
                    bufferStr += ',';
                }
                bufferStr = bufferStr.toUpperCase();
                if (bufferStr.indexOf(frameSync, offset * 3) != -1) {
                    return bufferStr.indexOf(frameSync, offset * 3) / 3;
                }
                if (i >= uint8Array.length) {
                    return 0;
                }
                count += 200;
            }
        } else {
            var flagReg = new RegExp(frameSync, 'g');
            var match = null;
            i = uint8Array.length - 1;
            count = uint8Array.length - 200;
            while (true) {
                for (; i > count && i > 0; i--) {
                    if (uint8Array[i] <= 15) {
                        bufferStr = '0' + uint8Array[i].toString(16) + ',' + bufferStr;
                    } else {
                        bufferStr = uint8Array[i].toString(16) + ',' + bufferStr;
                    }
                }
                bufferStr = bufferStr.toUpperCase();
                match = bufferStr.match(flagReg);
                if (match && match.length >= frameSize) { //找出多少帧
                    return bufferStr.length / 3 - bufferStr.indexOf(frameSync) / 3;
                }
                if (i == 0) {
                    return 0;
                }
                count -= 200;
            }
        }
    }

    exports.log = function() {
        if (location.search.indexOf('audio-debug') > -1) {
            console.log.apply(this, arguments);
        }
    }

    exports.testLog = function() {
        if (location.search.indexOf('audio-test') > -1) {
            console.log.apply(this, arguments);
        }
    }

    exports.ifDebug = function() {
        if (location.search.indexOf('audio-debug') > -1) {
            return true;
        }
    }

    exports.ifTest = function() {
        if (location.search.indexOf('audio-test') > -1) {
            return true;
        }
    }

    exports.formatCountDown = function(seconds, noZero) {
        var date = new Date();
        date.setDate(0);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setSeconds(seconds);
        var data = {
            date: Math.floor(seconds / (60 * 60 * 24)),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        }
        if (!noZero) {
            data.date = data.date >= 10 ? data.date : '0' + data.date;
            data.hours = data.hours >= 10 ? data.hours : '0' + data.hours;
            data.minutes = data.minutes >= 10 ? data.minutes : '0' + data.minutes;
            data.seconds = data.seconds >= 10 ? data.seconds : '0' + data.seconds;
        }
        return data;
    }
})