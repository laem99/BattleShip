import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Pressable } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import styles from '../style/style';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

const START = 'plus';
const MISS = 'cross';
const HIT = 'circle';

const NBR_OF_SHIPS = 3;
const BOMBS_LEFT = 15;
const WINNING_POINTS = 3;

let initialBoard = [
    START, START, START, START, START,
    START, START, START, START, START,
    START, START, START, START, START,
    START, START, START, START, START,
    START, START, START, START, START
];

let seconds = 0;

export default function Gameboard() {

    const [miss, setMiss] = useState(true);
    const [board, setBoard] = useState(initialBoard);
    const [ships, setShips] = useState([]);
    const [numShips, setNumShips] = useState(NBR_OF_SHIPS);
    const [bombsLeft, setBombsLeft] = useState(BOMBS_LEFT);
    const [hits, setHits] = useState(0);
    const [status, setStatus] = useState('');
    //const [button, setButton] = useState('Start Game');
    const [time, setTime] = useState(30);
    const [game, setGame] = useState(false);
    const timerRef = useRef();

    useEffect(() => {
        checkWinner();
        if (!game) {
            setStatus('Game has not started');
        }        
        if (hits < 0) {
            setBombsLeft(BOMBS_LEFT-1);
            setHits(0);
        }
        if (time === 0) {
            stop();
        }
    },[bombsLeft, time]);

// Clock functions
    function startTimer() {
        const id = setInterval(() => {
            setTime((time) => time-1);
        }, 1000);
        timerRef.current = id;
    }

    function stop() {
        clearInterval(timerRef.current);
    }

    //Button function (so the game works)

    function startGame() {

        if (status === 'You won, game over!' || status === 'Game over. Ships remaining.' || bombsLeft !== BOMBS_LEFT || time !== 30) {
            setGame(false);
            setShips([]);
            setHits(0);
            setTime(30);
            setBombsLeft(BOMBS_LEFT);
            setMiss(true);
            setNumShips(3);
            //setButton('Start Game');
            initialBoard = [
                START, START, START, START, START,
                START, START, START, START, START,
                START, START, START, START, START,
                START, START, START, START, START,
                START, START, START, START, START
            ];
            setBoard(initialBoard);
            
        }
        else {
            setStatus('Game is on...');
            //setButton('New Game');
            for (let i = 0; i < NBR_OF_SHIPS; i++) {
                let n =  Math.floor(Math.random() * 24) + 0;
                let check = ships.includes(n);
            
            if(check === false) {
                ships.push(n);
            } else {
                while(check === true){
                n = Math.floor(Math.random() * 24) + 0;
                check = ships.includes(n);
                    if(check === false){
                    ships.push(n);
                    }
                }
                }
            }
            
        }
    }

    //handels button click

    function handleClick() {
        if (!game) {
            startTimer();
            setGame(true);
        }
        startGame();
    }

    //checks winner

    function checkWinner() {

        if (hits >= WINNING_POINTS && bombsLeft === 0) {
            setStatus('You won!');
            stop();
        }
        else if (hits !== NBR_OF_SHIPS && bombsLeft === 0) {
            setStatus('Game over. Ships remaining.');
            stop();
        } else if (time === 0) {
            setStatus('Timeout! Ships remaining.')
            stop();
        }

    }

    //checks if there is a ship in the spot where user clicked

    function isThereAShip(number) {

       if (ships.includes(number)) {
           return(true);
       }
       else {
           return(false);
       }
    }

    //decides if its miss or hit

    function isMiss(number) {

        setStatus('Keep on bombing!');

        if (isThereAShip(number) === true) {
            board[number] = HIT;
            setMiss();
            setHits(hits+1);
            setBombsLeft(bombsLeft-1);
            setNumShips(numShips-1);
            checkWinner(number);
        }
        else {
            board[number] = MISS;
            setMiss(!miss);
            setBombsLeft(bombsLeft-1);
            checkWinner(number);
        }
    }

    //draws on item to the clicked spot

    function drawItem(number) {

        if (status !== 'Game is on...' && status !== 'Keep on bombing!') {
            setStatus('Click the game button first...');  
        }
        else if (board[number] === START && winGame() === "") {
            isMiss(number);
                
            if (winGame() !== "") {
                setStatus(winGame());
            }
        }
    }

    //chooses color of the item

    function chooseItemColor(number) {
        if(board[number] === MISS) {
            return "#FF3031";
        }
        else if (board[number] === HIT) {
            return "#45CE30";
        }
        else {
            return "#74B9FF";
        }
    }

    function winGame() {
        if (ships === 0) {
            return setStatus('You sinked all ships!');
        }
        else {
            return "";
        }
    }

    return(
        <View style={styles.gameboard}>
            <View style={styles.flex}>
                <Pressable key={0} style={styles.row} onPress={() => drawItem(0)}>
                    <Entypo key={0} name={board[0]} size={32} color={chooseItemColor(0)} />
                </Pressable>
                <Pressable key={1} style={styles.row} onPress={() => drawItem(1)}>
                    <Entypo key={1} name={board[1]} size={32} color={chooseItemColor(1)} /> 
                </Pressable>
                <Pressable key={2} style={styles.row} onPress={() =>  drawItem(2)}>
                    <Entypo key={2} name={board[2]} size={32} color={chooseItemColor(2)} /> 
                </Pressable>
                <Pressable key={3} style={styles.row} onPress={() =>  drawItem(3)}>
                    <Entypo key={3} name={board[3]} size={32} color={chooseItemColor(3)} /> 
                </Pressable>
                <Pressable key={4} style={styles.row} onPress={() =>  drawItem(4)}>
                    <Entypo key={4} name={board[4]} size={32} color={chooseItemColor(4)} /> 
                </Pressable>
            </View>
            <View style={styles.flex}>
                <Pressable key={5} style={styles.row} onPress={() => drawItem(5)}>
                    <Entypo key={5} name={board[5]} size={32} color={chooseItemColor(5)} />
                </Pressable>
                <Pressable key={6} style={styles.row} onPress={() => drawItem(6)}>
                    <Entypo key={6} name={board[6]} size={32} color={chooseItemColor(6)} /> 
                </Pressable>
                <Pressable key={7} style={styles.row} onPress={() =>  drawItem(7)}>
                    <Entypo key={7} name={board[7]} size={32} color={chooseItemColor(7)} /> 
                </Pressable>
                <Pressable key={8} style={styles.row} onPress={() =>  drawItem(8)}>
                    <Entypo key={8} name={board[8]} size={32} color={chooseItemColor(8)} /> 
                </Pressable>
                <Pressable key={9} style={styles.row} onPress={() =>  drawItem(9)}>
                    <Entypo key={9} name={board[9]} size={32} color={chooseItemColor(9)} /> 
                </Pressable>
            </View>
            <View style={styles.flex}>
                <Pressable key={10} style={styles.row} onPress={() => drawItem(10)}>
                    <Entypo key={10} name={board[10]} size={32} color={chooseItemColor(10)} />
                </Pressable>
                <Pressable key={11} style={styles.row} onPress={() => drawItem(11)}>
                    <Entypo key={11} name={board[11]} size={32} color={chooseItemColor(11)} /> 
                </Pressable>
                <Pressable key={12} style={styles.row} onPress={() =>  drawItem(12)}>
                    <Entypo key={12} name={board[12]} size={32} color={chooseItemColor(12)} /> 
                </Pressable>
                <Pressable key={13} style={styles.row} onPress={() =>  drawItem(13)}>
                    <Entypo key={13} name={board[13]} size={32} color={chooseItemColor(13)} /> 
                </Pressable>
                <Pressable key={14} style={styles.row} onPress={() =>  drawItem(14)}>
                    <Entypo key={14} name={board[14]} size={32} color={chooseItemColor(14)} /> 
                </Pressable>
            </View>
            <View style={styles.flex}>
                <Pressable key={15} style={styles.row} onPress={() => drawItem(15)}>
                    <Entypo key={15} name={board[15]} size={32} color={chooseItemColor(15)} />
                </Pressable>
                <Pressable key={16} style={styles.row} onPress={() => drawItem(16)}>
                    <Entypo key={16} name={board[16]} size={32} color={chooseItemColor(16)} /> 
                </Pressable>
                <Pressable key={17} style={styles.row} onPress={() =>  drawItem(17)}>
                    <Entypo key={17} name={board[17]} size={32} color={chooseItemColor(17)} /> 
                </Pressable>
                <Pressable key={18} style={styles.row} onPress={() =>  drawItem(18)}>
                    <Entypo key={18} name={board[18]} size={32} color={chooseItemColor(18)} /> 
                </Pressable>
                <Pressable key={19} style={styles.row} onPress={() =>  drawItem(19)}>
                    <Entypo key={19} name={board[19]} size={32} color={chooseItemColor(19)} /> 
                </Pressable>
            </View>
            <View style={styles.flex}>
                <Pressable key={20} style={styles.row} onPress={() =>  drawItem(20)}>
                    <Entypo key={20} name={board[20]} size={32} color={chooseItemColor(20)} /> 
                </Pressable>
                <Pressable key={21} style={styles.row} onPress={() =>  drawItem(21)}>
                    <Entypo key={21} name={board[21]} size={32} color={chooseItemColor(21)} /> 
                </Pressable>
                <Pressable key={22} style={styles.row} onPress={() =>  drawItem(22)}>
                    <Entypo key={22} name={board[22]} size={32} color={chooseItemColor(22)} /> 
                </Pressable>
                <Pressable key={23} style={styles.row} onPress={() =>  drawItem(23)}>
                    <Entypo key={23} name={board[23]} size={32} color={chooseItemColor(23)} /> 
                </Pressable>
                <Pressable key={24} style={styles.row} onPress={() =>  drawItem(24)}>
                    <Entypo key={24} name={board[24]} size={32} color={chooseItemColor(24)} /> 
                </Pressable>
            </View>
            <View style={styles.view}>
            <Pressable style={styles.button} onPress={() => handleClick()}>
                <Text style={styles.buttonText}>{game ? 'New Game' : 'Start Game'}</Text>
            </Pressable>
            <Text style={styles.gameinfo}>Hits: {hits}</Text>
            <Text style={styles.gameinfo}>Bombs: {bombsLeft}</Text>
            <Text style={styles.gameinfo}>Ships: {numShips}</Text>
            </View>
            <Text style={styles.gameinfo}>Time: {time} sec</Text>
            <Text style={styles.gameinfo}>Status: {status}</Text>
        </View>
    )

}